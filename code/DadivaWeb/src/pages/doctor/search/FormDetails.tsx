import { QuestionWithAnswer } from "./utils/DoctorSearchAux";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import React from "react";

interface FormDetailsProps {
  formWithAnswers: QuestionWithAnswer[];
}

export function FormDetails({ formWithAnswers }: FormDetailsProps) {
  return (
    <Box sx={{ border: 1}}>
      {formWithAnswers.map((item, index) => (
        <Box key={index} sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Typography variant="h6">{item.question}</Typography>
          <Typography variant="body1">{item.answer.toString()}</Typography>
        </Box>
      ))}
    </Box>
  );
}