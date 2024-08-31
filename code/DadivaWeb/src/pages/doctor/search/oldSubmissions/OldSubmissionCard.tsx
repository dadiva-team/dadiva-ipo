import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  FormControlLabel,
  IconButton,
  IconButtonProps,
  styled,
  Switch,
  Typography,
} from '@mui/material';
import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ReviewHistoryModel, ReviewStatus } from '../../../../services/doctors/models/SubmissionHistoryOutputModel';
import { OldSubmissionsAnswers } from './OldSubmissionAnswers';
import { lightGreen, lightRed } from '../../../../components/shared/uiColors';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

interface OldSubmissionCardProps {
  review: ReviewHistoryModel;
  isLastSubmission: boolean;
}

export function OldSubmissionCard({ review, isLastSubmission }: OldSubmissionCardProps) {
  const [expanded, setExpanded] = React.useState(false);
  const [notesVisible, setNotesVisible] = React.useState(true);
  const cardBorder = review.status === ReviewStatus.Approved ? lightGreen : lightRed;

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ margin: 1, border: 2, borderColor: cardBorder }}>
      <CardHeader
        title={`Data da Submissão: ${new Date(review.submission.submissionDate).toLocaleDateString()}`}
        subheader={`Estado: ${review.status === ReviewStatus.Approved ? 'Aprovado' : 'Rejeitado'}`}
      />
      <CardActions disableSpacing>
        <Box sx={{ flexDirection: 'row' }}>
          <Typography sx={{ pl: 1 }}>
            <strong>Medico:</strong> {review.doctor.name}
          </Typography>
          {review.finalNote.length != 0 && (
            <Typography paragraph sx={{ pl: 1 }}>
              <strong> Nota Final:</strong> {review.finalNote}
            </Typography>
          )}
        </Box>
        <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more">
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
            <Typography variant="h6">Respostas</Typography>
            {review.submission && (
              <FormControlLabel
                value="top"
                control={
                  <Switch checked={notesVisible} onChange={() => setNotesVisible(!notesVisible)} color="primary" />
                }
                label="Mostrar Notas"
                labelPlacement="top"
              />
            )}
          </Box>
          <OldSubmissionsAnswers submission={review.submission} isLastSubmission={isLastSubmission} />
        </CardContent>
      </Collapse>
    </Card>
  );
}
