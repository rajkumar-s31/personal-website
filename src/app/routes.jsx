import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Curricular from '../pages/Curricular';
import CoCurricular from '../pages/CoCurricular';
import ExtraCurricular from '../pages/ExtraCurricular';
import Contact from '../pages/Contact';

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/curricular" element={<Curricular />} />
            <Route path="/co-curricular" element={<CoCurricular />} />
            <Route path="/extra-curricular" element={<ExtraCurricular />} />
            <Route path="/contact" element={<Contact />} />
        </Routes>
    );
};

export default AppRoutes;
