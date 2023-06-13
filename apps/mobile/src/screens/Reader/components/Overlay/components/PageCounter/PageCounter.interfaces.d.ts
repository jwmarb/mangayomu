import React from 'react';

export interface PageCounterProps {
  page?: number;
  totalPages?: number;
  pageCounterStyle: {
    transform: {
      translateY: number;
    }[];
  };
}
