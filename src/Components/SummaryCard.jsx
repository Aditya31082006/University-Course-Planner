import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useCountUp } from '../utils/useCountUp';

/**
 * `color` should be a plain hex string (e.g. theme.palette.primary.main),
 * not a palette path — this keeps the tinted icon background correct in
 * both light and dark mode without relying on CSS-variable theming.
 */
export default function SummaryCard({ icon, label, value, suffix = '', color, decimals = 0 }) {
  const theme = useTheme();
  const resolvedColor = color || theme.palette.primary.main;
  const animated = useCountUp(value);
  const displayValue = decimals > 0 ? animated.toFixed(decimals) : Math.round(animated);

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha(resolvedColor, theme.palette.mode === 'light' ? 0.12 : 0.22),
            color: resolvedColor,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>
        <Box sx={{ overflow: 'hidden' }}>
          <Typography variant="h5" fontWeight={700} noWrap>
            {displayValue}
            {suffix}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {label}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
