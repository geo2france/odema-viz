import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '../components/Header/Header';

export default () => {
  const { id } = useParams<{ id: string }>();

  useEffect(() => {}, []);

  return (
    <>
      <Header />
    </>
  );
};
