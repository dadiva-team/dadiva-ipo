import {
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Collapse,
    IconButton,
    IconButtonProps,
    styled,
    Typography
} from "@mui/material";
import {SubmissionHistory} from "../../../../domain/Submission/SubmissionHistory";
import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {expand, ...other} = props;
    return <IconButton {...other} />;
})(({theme, expand}) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));


interface OldSubmissionCardProps {
    submission: SubmissionHistory;
}

export function OldSubmissionCard({submission}: OldSubmissionCardProps) {
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Card sx={{margin: 2}}>
            <CardHeader
                title={`Data da Submissão: ${new Date(submission.submissionDate).toLocaleDateString()}`}
                subheader={`Estado: ${submission.reviewStatus}`}
            />
            <CardActions disableSpacing>
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon/>
                </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography paragraph><strong>Submission ID:</strong> {submission.submissionId}</Typography>
                    <Typography paragraph><strong>Form Version:</strong> {submission.formVersion}</Typography>
                    <Typography paragraph><strong>Review
                        Date:</strong> {new Date(submission.reviewDate).toLocaleDateString()}</Typography>
                    <Typography paragraph><strong>NIC DADOR:</strong> {submission.byUserNic}</Typography>
                    <Typography paragraph><strong>Doctor NIC:</strong> {submission.doctorNic}</Typography>
                    <Typography paragraph><strong>Answers:</strong></Typography>
                    {/*submission.answers.map((answer, index) => (
                        <Box key={index} sx={{ marginLeft: 2 }}>
                            <Typography paragraph><strong>Question ID:</strong> {answer.questionId}</Typography>
                            <Typography paragraph><strong>Answer:</strong> {answer.answer}</Typography>
                        </Box>
                    ))*/}
                </CardContent>
            </Collapse>
        </Card>
    );
}