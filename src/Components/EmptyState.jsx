import React from 'react';
import { Box, Typography, Button } from '@mui/material';

function PlannerIllustration() {
  return (
    <svg width="140" height="120" viewBox="0 0 140 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="22" width="112" height="84" rx="12" fill="var(--mui-palette-action-hover, #eef2f7)" />
      <rect x="14" y="22" width="112" height="22" rx="12" fill="#1976d2" opacity="0.85" />
      <circle cx="30" cy="33" r="4" fill="#fff" opacity="0.9" />
      <circle cx="44" cy="33" r="4" fill="#fff" opacity="0.6" />
      <rect x="28" y="56" width="34" height="10" rx="4" fill="#42a5f5" opacity="0.55" />
      <rect x="28" y="72" width="50" height="10" rx="4" fill="#c98a2c" opacity="0.45" />
      <rect x="28" y="88" width="22" height="10" rx="4" fill="#1976d2" opacity="0.35" />
      <rect x="86" y="56" width="26" height="42" rx="6" fill="#1976d2" opacity="0.18" />
    </svg>
  );
}

export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        py: 6,
        px: 3,
      }}
    >
      <PlannerIllustration />
      <Typography variant="h6" sx={{ mt: 2, fontFamily: "'Lora', serif" }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 360 }}>
        {description}
      </Typography>
      {actionLabel && (
        <Button variant="contained" sx={{ mt: 2.5 }} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
