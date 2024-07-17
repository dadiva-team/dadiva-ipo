import {
    Box, Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    InputLabel, MenuItem,
    Radio,
    RadioGroup,
    Select, TextField,
    Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {SuspensionType, UserSuspension} from "../../../../domain/User/UserSuspension";
import {handleError, handleRequest} from "../../../../services/utils/fetch";
import {DoctorServices} from "../../../../services/doctors/DoctorServices";
import {SuspendUserRequestModel} from "../../../../services/doctors/models/SuspendeUserRequestModel";
import {useCurrentSession} from "../../../../session/Session";
import {useNavigate} from "react-router-dom";
import {ErrorAlert} from "../../../../components/shared/ErrorAlert";
import {DonorSuspensionCard} from "./DonorSuspensionCard";

interface DonorSuspensionProps {
    nic: string;
    fetchedSuspension?: UserSuspension;
    onSubmitedSuccessfully: () => void;
}

export function DonorSuspension({nic, fetchedSuspension, onSubmitedSuccessfully}: DonorSuspensionProps) {
    const doctor = useCurrentSession();
    const nav = useNavigate();
    const [error, setError] = useState<string | null>(null);

    const [suspensionType, setSuspensionType] = useState<SuspensionType | null>(null);
    const [months, setMonths] = useState<string>('');
    const [reason, setReason] = useState('');

    const today = new Date().toISOString();
    const [suspensionStartDateToday, setSuspensionStartDateToday] = useState<boolean>(true);
    const [suspensionStartDate, setSuspensionStartDate] = useState(today.split('T')[0]);
    const [suspensionEndDate, setSuspensionEndDate] = useState('');


    const submitSuspension = async () => {
        console.log('submit suspension')
        const request = {
            userNic: Number(nic),
            suspensionType: suspensionType,
            suspensionStartDate: suspensionStartDate,
            suspensionEndDate: suspensionEndDate,
            reason: reason,
            suspendedBy: doctor.nic
        } as SuspendUserRequestModel;
        const [error, res] = await handleRequest(DoctorServices.suspendUser(request))
        if (error) {
            handleError(error, setError, nav)
        } else {
            console.log(res)
            onSubmitedSuccessfully();
        }
    }


    useEffect(() => {
        if (suspensionStartDateToday) {
            setSuspensionStartDate(today.split('T')[0]);
        } else {
            setSuspensionStartDate('')
        }
    }, [suspensionStartDateToday, today]);

    //TODO get a better way to calculate the duration

    const calculateDuration = () => {
        if (suspensionStartDate && suspensionEndDate) {
            const startDate = new Date(suspensionStartDate);
            const endDate = new Date(suspensionEndDate);
            const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            return `${duration} dias`;
        }
    };

    useEffect(() => {
        console.log(suspensionStartDate, suspensionEndDate)
    }, [suspensionStartDate, suspensionEndDate])


    return (
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
            {fetchedSuspension ? (
               <DonorSuspensionCard userSuspension={fetchedSuspension}/>
            ) : (
                <>
                    {error && <ErrorAlert error={error} clearError={() => setError(null)}/>}
                    <Typography>Suspender Dador</Typography>
                    <FormControl>
                        <FormLabel>Tipo de suspensão</FormLabel>
                        <RadioGroup
                            row
                            onChange={(e) => setSuspensionType(Number(e.target.value) as SuspensionType)}
                        >
                            <FormControlLabel value={SuspensionType.BetweenDonations} control={<Radio/>}
                                              label="Entre Dadivas"/>
                            <FormControlLabel value={SuspensionType.Other} control={<Radio/>} label="Outro"/>
                            <FormControlLabel value={SuspensionType.Permanent} control={<Radio color="error"/>}
                                              label="Permanente"/>
                        </RadioGroup>
                    </FormControl>
                    {suspensionType === SuspensionType.BetweenDonations && (
                        <FormControl sx={{width: '50%'}}>
                            <InputLabel>Duração</InputLabel>
                            <Select
                                value={months}
                                onChange={(e) => setMonths(e.target.value)}
                                label="Duração"
                                required
                            >
                                <MenuItem value="2">2 Meses</MenuItem>
                                <MenuItem value="3">3 Meses</MenuItem>
                            </Select>

                        </FormControl>
                    )}
                    {suspensionType === SuspensionType.Permanent && (
                        <TextField
                            sx={{width: '70%'}}
                            multiline={true}
                            rows={3}
                            label="Motivo"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                        />
                    )}
                    {suspensionType === SuspensionType.Other && (
                        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                            <Box sx={{display: 'flex', flexDirection: 'row', gap: 1}}>
                                <FormControl sx={{width: '15%'}}>
                                    <InputLabel>Inicio</InputLabel>
                                    <Select
                                        value={suspensionStartDateToday ? 'today' : 'other'}
                                        onChange={(e) => {
                                            setSuspensionStartDateToday(e.target.value === 'today')
                                        }}
                                        label="Duration"
                                        required
                                    >
                                        <MenuItem value="today">Hoje</MenuItem>
                                        <MenuItem value="other">Custom</MenuItem>
                                    </Select>
                                </FormControl>
                                {!suspensionStartDateToday && (
                                    <TextField
                                        label="Inicio"
                                        type="date"
                                        InputLabelProps={{shrink: true}}
                                        value={suspensionStartDate}
                                        onChange={(e) => setSuspensionStartDate(e.target.value)}
                                        sx={{my: 1}}
                                    />
                                )}
                                <TextField
                                    label="Fim"
                                    type="date"
                                    InputLabelProps={{shrink: true}}
                                    value={suspensionEndDate}
                                    onChange={(e) => setSuspensionEndDate(e.target.value.split('T')[0])}
                                    required
                                />
                            </Box>
                            {/*suspensionStartDate && <Typography>
                        Data de inicio: {suspensionStartDate}
                    </Typography>*/}
                            {/*suspensionEndDate && <Typography>
                        Data do fim: {suspensionEndDate}
                    </Typography>*/}

                            {suspensionStartDate && suspensionEndDate && <Typography>
                                Duração: {calculateDuration()}
                            </Typography>}
                            <TextField
                                sx={{width: '70%'}}
                                multiline={true}
                                rows={2}
                                label="Motivo"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                required
                            />
                        </Box>
                    )}
                    <Button disabled={!suspensionStartDate || !suspensionEndDate} onClick={submitSuspension}
                            sx={{color: 'error'}}>
                        Suspender
                    </Button>
                </>)}
        </Box>
    );
}