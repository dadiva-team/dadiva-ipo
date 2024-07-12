import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleRequest } from '../../../services/utils/fetch';
import { DoctorServices } from '../../../services/doctors/DoctorServices';
import { FormServices } from '../../../services/from/FormServices';
import { Submission } from '../../../domain/Submission/Submission';
import { User } from "../../../domain/User/User";
import { Group } from '../../../domain/Form/Form';
import { Inconsistency, extractInconsistencies } from "./utils/DoctorSearchAux";
import { SubmissionHistoryModel } from "../../../services/doctors/models/SubmissionHistoryOutputModel";

export function useDoctorSearch() {
    const nav = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [errorForm, setErrorForm] = useState<string | null>(null);
    const [errorSubmission, setErrorSubmission] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [nic, setNic] = useState<string>('');
    const [pendingSubmission, setPendingSubmission] = useState<Submission | null>(null);

    const [oldSubmissions, setOldSubmissions] = useState<Map<SubmissionHistoryModel, Group[]>>(new Map());
    const [user, setUser] = useState<User | null>(null);

    const [formGroupsCache, setFormGroupsCache] = useState<Map<number, Group[]> | null>(null);
    const [inconsistencies, setInconsistencies] = useState<Inconsistency[] | null>(null);
    const [pendingView, setPendingView] = useState<boolean | null>(null);
    const [oldView, setOldView] = useState<boolean | null>(null);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [submissionLimit, setSubmissionLimit] = useState(2);
    const [submissionSkip, setSubmissionSkip] = useState(0);
    const [hasMoreSubmissions, setHasMoreSubmissions] = useState(true);

    const fetchFormGroups = async (formVersion: number): Promise<Group[]> => {
        if (formGroupsCache?.has(formVersion)) {
            return formGroupsCache.get(formVersion)!;
        } else {
            const [error, res] = await handleRequest(FormServices.getFormByVersion(formVersion));
            if (error) {
                handleError(error, setErrorForm, nav);
                return [];
            }
            const formGroups = res.groups as Group[];
            if (formGroupsCache) {
                setFormGroupsCache(new Map(formGroupsCache.set(formVersion, formGroups)));
            } else {
                setFormGroupsCache(new Map([[formVersion, formGroups]]));
            }
            return formGroups;
        }
    };

    const fetchInconsistencies = async () => {
        if (inconsistencies) return;
        const [error, res] = await handleRequest(FormServices.getInconsistencies());
        if (error) {
            handleError(error, setError, nav);
            setIsLoading(false);
            return;
        }
        const inc = res.length > 0 ? extractInconsistencies(res[0]) : [];
        setInconsistencies(inc.length == 0 ? null : inc);
    };

    const fetchUser = async () => {
        setError(null);
        setIsLoading(true);
        const [error, res] = await handleRequest(DoctorServices.getUserByNic(Number(nic)));

        if (error) {
            handleError(error, setError, nav);
            setPendingSubmission(null);
            setUser(null);
            setIsLoading(false);
            return;
        }

        setUser({ name: res.name, nic: res.nic.toString() });
        setIsLoading(false);
    };

    const fetchPendingSubmission = async () => {
        if (!user) return;
        if (errorSubmission) setErrorSubmission(null);

        const [error, res] = await handleRequest(DoctorServices.getPendingSubmissionByNic(Number(user.nic)));
        if (error) {
            handleError(error, setErrorSubmission, nav);
            setPendingSubmission(null);
            return;
        }
        await fetchFormGroups(res.formVersion);
        await fetchInconsistencies();

        setPendingSubmission(res as Submission);
        setPendingView(true);
        setOldView(false)
    };

    const fetchSubmissionHistory = async (limit: number, skip: number, reset: boolean) => {
        if (!user) return;
        if (errorSubmission) setErrorSubmission(null);
        if (reset) {
            console.log('Resetting old submissions');
            setSubmissionSkip(0)
        }

        const [error, res] = await handleRequest(DoctorServices.getSubmissionHistoryByNic(Number(user.nic), limit, skip));
        if (error) {
            handleError(error, setErrorSubmission, nav);
            setOldSubmissions(new Map());
            return;
        }
        await fetchInconsistencies();
        const { submissionHistory, hasMoreSubmissions } = res

        const newOldSubmissionsMap = new Map(reset ? [] : oldSubmissions);
        for (const submission of submissionHistory) {
            const formGroups = await fetchFormGroups(submission.formVersion);
            newOldSubmissionsMap.set(submission, formGroups);
        }

        setOldSubmissions(newOldSubmissionsMap);
        setHasMoreSubmissions(hasMoreSubmissions);

        setOldView(true);
        setPendingView(false);
    };

    const loadMoreSubmissions = () => {
        const newSkip = submissionSkip + submissionLimit;
        console.log('Loading more submissions');
        console.log("Skip: " + newSkip);
        setSubmissionSkip(newSkip);
        fetchSubmissionHistory(submissionLimit, newSkip, false);
    };

    const togglePendingView = () => {
        setPendingView(true);
        setOldView(false);
    };

    const toggleOldView = () => {
        setPendingView(false);
        setOldView(true);
    };

    return {
        error,
        errorForm,
        errorSubmission,
        isLoading,
        nic,
        pendingSubmission,
        oldSubmissions,
        user,
        formGroupsCache,
        inconsistencies,
        pendingView,
        oldView,
        submissionLimit,
        submissionSkip,
        hasMoreSubmissions,
        setNic,
        setError,
        setErrorForm,
        setErrorSubmission,
        fetchUser,
        fetchPendingSubmission,
        fetchSubmissionHistory,
        loadMoreSubmissions,
        togglePendingView,
        toggleOldView,
    };
}
