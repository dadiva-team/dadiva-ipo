import {Box, Button, Divider, Radio} from '@mui/material';
import React from 'react';
import Typography from '@mui/material/Typography';
import UpdateIcon from '@mui/icons-material/Update';
import {User} from "../../../domain/User/User";

interface DoctorSearchButtonsProps {
    user: User;
    pendingView: boolean;
    historyView: boolean;
    onCheckPendingSubmission: () => void;
    onCheckOldSubmissions: (reset: boolean) => void;
    onTogglePendingView: () => void;
    onToggleHistoryView: () => void;
    pendingAndOldView: boolean;
}

export function DoctorSearchButtons(
    {
        user,
        pendingView,
        historyView,
        onCheckPendingSubmission,
        onCheckOldSubmissions,
        onTogglePendingView,
        onToggleHistoryView,
        pendingAndOldView
    }: DoctorSearchButtonsProps) {
    return (
        <Box sx={{marginLeft: 1, width: pendingAndOldView ? '12%' : '17%', justifyContent: 'flex-start'}}>
            <Typography variant="h6" component="div">
                {user.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
                NIC: {user.nic}
            </Typography>
            <Box sx={{display: 'flex', flexDirection: 'column', pt: 3, gap: 1}}>
                {pendingView || pendingAndOldView ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <Typography variant="body2" color="textSecondary" sx={{flexGrow: 1}}>
                            {'Submissão pendente'}
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <Button variant="outlined" onClick={onCheckPendingSubmission} endIcon={<UpdateIcon/>}/>
                            {pendingAndOldView && (
                                <Radio
                                    onChange={onTogglePendingView}
                                    checked={pendingView}
                                    value="pendingSubmissions"
                                    name="radio-buttons"
                                    inputProps={{'aria-label': 'A'}}
                                />
                            )}
                        </Box>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <Button variant="outlined" onClick={onCheckPendingSubmission} sx={{flexGrow: 1}}>
                            {'Submissão pendente'}
                        </Button>
                    </Box>
                )}
                {historyView || pendingAndOldView ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <Typography variant="body2" color="textSecondary" sx={{flexGrow: 1}}>
                            {'Submissões antigas'}
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            gap: 1
                        }}>
                            <Button variant="outlined" onClick={() => onCheckOldSubmissions(true)}
                                    endIcon={<UpdateIcon/>}/>
                            {pendingAndOldView && (
                                <Radio
                                    onChange={onToggleHistoryView}
                                    checked={historyView}
                                    value="oldSubmissions"
                                    name="radio-buttons"
                                    inputProps={{'aria-label': 'A'}}
                                />
                            )}
                        </Box>
                    </Box>
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            gap: 1,
                        }}
                    >
                        <Button variant="outlined" onClick={() => onCheckOldSubmissions(false)} sx={{flexGrow: 1}}>
                            {'Submissões antigas'}
                        </Button>
                    </Box>
                )}
                <Divider sx={{my: 2 }}/>
                <Button
                    variant="outlined"
                    sx={{
                        color: '#f44336',
                        borderColor: '#f44336',
                        '&:hover': {
                            backgroundColor: 'rgba(244, 67, 54, 0.04)',
                            borderColor: '#f44336',
                        }
                    }}
                >
                    Suspender
                </Button>
            </Box>
        </Box>
    );
}
