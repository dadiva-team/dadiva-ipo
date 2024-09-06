import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { handleError, handleRequest } from '../../../services/utils/fetch';
import { DoctorServices } from '../../../services/doctors/DoctorServices';
import { User } from '../../../domain/User/User';
import { ReviewHistoryModel } from '../../../services/doctors/models/SubmissionHistoryOutputModel';
import { Problem } from '../../../services/utils/Problem';
import { UserSuspension } from '../../../domain/User/UserSuspension';
import { useCurrentSession } from '../../../session/Session';
import { SubmissionModel } from '../../../services/doctors/models/SubmissionOutputModel';

export function useDoctorSearch() {
  const nav = useNavigate();
  const location = useLocation();
  const doc = useCurrentSession();

  const [error, setError] = useState<string | null>(null);
  const [errorForm, setErrorForm] = useState<string | null>(null);
  const [errorSubmission, setErrorSubmission] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [nic, setNic] = useState<string>('');
  const [pendingSubmission, setPendingSubmission] = useState<SubmissionModel | null>(null);

  const [reviewsHistory, setReviewsHistory] = useState<ReviewHistoryModel[]>(null);
  const [user, setUser] = useState<User | null>(null);

  const [fetchedSuspension, setFetchedSuspension] = useState<UserSuspension | null>(null);
  const [suspensionHistory, setSuspensionHistory] = useState<UserSuspension[] | null>(null);

  const [pendingView, setPendingView] = useState<boolean | null>(null);
  const [reviewHistoryView, setReviewHistoryView] = useState<boolean | null>(null);
  const [suspensionView, setSuspensionView] = useState<boolean | null>(null);
  const [suspensionHistoryView, setSuspensionHistoryView] = useState<boolean | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [submissionLimit, setSubmissionLimit] = useState(2);
  const [submissionSkip, setSubmissionSkip] = useState(0);
  const [hasMoreSubmissions, setHasMoreSubmissions] = useState(true);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
  const fromPendingSubmissionSearch = useRef(true);

  const resetErrors = () => {
    setError(null);
    setErrorForm(null);
    setErrorSubmission(null);
  };
  const resetState = () => {
    setPendingSubmission(null);
    setReviewsHistory(null);
    setUser(null);
    setPendingView(false);
    setReviewHistoryView(false);
    setSuspensionHistoryView(false);
    resetErrors();
  };

  const handleSearchAndUpdateQuery = () => {
    const params = new URLSearchParams(window.location.search);
    params.set('nic', nic);
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);

    resetState();
    fetchUser(nic);
  };

  const fetchUser = useCallback(
    async (nic: string) => {
      setError(null);
      setIsLoading(true);
      const [error, res] = await handleRequest(DoctorServices.getUserByNic(Number(nic)));

      if (error) {
        handleError(error, setError, nav, location.pathname);
        setPendingSubmission(null);
        setUser(null);
        setIsLoading(false);
        return;
      }

      console.log('res!!!', res);

      setUser({ name: res.name, nic: res.nic.toString() });
      setIsLoading(false);
    },
    [nav, location.pathname]
  );

  const fetchPendingSubmission = async () => {
    if (!user) return;
    if (errorSubmission) setErrorSubmission(null);

    const [error, res] = await handleRequest(DoctorServices.getPendingSubmissionByNic(user.nic));
    if (error) {
      handleError(error, setErrorSubmission, nav, location.pathname);
      setPendingSubmission(null);
      return;
    }
    console.log('Pending submission:', res);
    if (res.lock != null && res?.lock?.doctor.nic != doc?.nic.toString()) {
      setPendingSubmission(null);
      setErrorSubmission('A submissão pendente está a ser vista por outro médico.\nPor favor, tente mais tarde.');
      return;
    }

    setPendingSubmission(res as SubmissionModel);
    setPendingView(true);
    setReviewHistoryView(false);
    setSuspensionView(false);
    setSuspensionHistoryView(false);
  };

  const fetchReviewHistory = async (limit: number, skip: number, reset: boolean) => {
    if (!user) return;
    if (errorSubmission) setErrorSubmission(null);
    if (reset) {
      console.log('Resetting old submissions');
      setSubmissionSkip(0);
    }

    const [error, res] = await handleRequest(DoctorServices.getReviewsHistoryByUserNIC(Number(user.nic), limit, skip));
    if (error) {
      handleError(error, setErrorSubmission, nav, location.pathname);
      setReviewsHistory(null);
      return;
    }
    console.log('Old submissions:', res);

    const { submissionHistory, hasMoreSubmissions } = res;

    setReviewsHistory(submissionHistory);
    setHasMoreSubmissions(hasMoreSubmissions);

    setReviewHistoryView(true);
    setPendingView(false);
    setSuspensionView(false);
    setSuspensionHistoryView(false);
  };

  const fetchSuspension = async () => {
    const [error, res] = await handleRequest(DoctorServices.getDonorSuspension(Number(nic)));
    if (error) {
      if (error instanceof Problem && (error.status === 404 || error.status === 400)) {
        setSuspensionView(true);
        setReviewHistoryView(false);
        setPendingView(false);
        return;
      }
      handleError(error, setError, nav, location.pathname);
    }
    if (res) {
      setFetchedSuspension(res);

      setSuspensionView(true);
      setSuspensionHistoryView(false);
      setReviewHistoryView(false);
      setPendingView(false);
    }
  };

  const fetchSuspensionHistory = async () => {
    const [error, res] = await handleRequest(DoctorServices.getDonorSuspensionHistory(Number(nic)));
    if (error) {
      handleError(error, setError, nav, location.pathname);
    }
    console.log('Suspension history:', res);
    console.log('Suspension :', res.suspensions);
    if (res) {
      setSuspensionHistory(res.suspensions);
      setSuspensionHistoryView(true);
      setSuspensionView(false);
      setReviewHistoryView(false);
      setPendingView(false);
    }
  };

  const loadMoreReviews = async () => {
    const newSkip = submissionSkip + submissionLimit;
    console.log('Loading more submissions');
    console.log('Skip: ' + newSkip);

    // Fetch more submissions
    const [error, res] = await handleRequest(
      DoctorServices.getReviewsHistoryByUserNIC(Number(user.nic), submissionLimit, newSkip)
    );
    if (error) {
      handleError(error, setErrorSubmission, nav, location.pathname);
      return;
    }

    const { submissionHistory, hasMoreSubmissions } = res;

    // Append the new submissions to the existing ones
    setReviewsHistory(prevReviewsHistory => [...(prevReviewsHistory || []), ...submissionHistory]);

    setSubmissionSkip(newSkip);
    setHasMoreSubmissions(hasMoreSubmissions);
  };

  const togglePendingView = () => {
    setReviewHistoryView(false);
    setSuspensionView(false);
    setPendingView(true);
    setSuspensionHistoryView(false);
  };

  const toggleOldView = () => {
    setPendingView(false);
    setSuspensionView(false);
    setReviewHistoryView(true);
    setSuspensionHistoryView(false);
  };

  const toggleSuspensionView = () => {
    setPendingView(false);
    setReviewHistoryView(false);
    setSuspensionView(true);
    setSuspensionHistoryView(false);
  };

  const toggleSuspensionHistoryView = () => {
    setSuspensionHistoryView(true);
    setReviewHistoryView(false);
    setPendingView(false);
    setSuspensionView(false);
  };

  const onSubmitedSuccessfully = () => {
    setPendingView(false);
    setPendingSubmission(null);
    setSuspensionView(null);
  };

  useEffect(() => {
    if (searchParams.has('nic') && fromPendingSubmissionSearch.current) {
      const nicParam = searchParams.get('nic')!;
      if (nicParam.length === 8) {
        setNic(nicParam);
        fetchUser(nicParam);
        fromPendingSubmissionSearch.current = false;
      }
    }
  }, [fetchUser, searchParams]);

  return {
    error,
    errorForm,
    errorSubmission,
    isLoading,
    nic,
    pendingSubmission,
    reviewsHistory,
    user,
    fetchedSuspension,
    suspensionHistory,
    pendingView,
    reviewHistoryView,
    suspensionView,
    suspensionHistoryView,
    submissionLimit,
    submissionSkip,
    hasMoreSubmissions,
    setNic,
    setError,
    setErrorForm,
    setErrorSubmission,
    fetchPendingSubmission,
    fetchReviewHistory,
    fetchSuspension,
    fetchSuspensionHistory,
    loadMoreReviews,
    togglePendingView,
    toggleOldView,
    toggleSuspensionView,
    toggleSuspensionHistoryView,
    handleSearchAndUpdateQuery,
    onSubmitedSuccessfully,
  };
}
