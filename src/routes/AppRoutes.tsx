import { Routes, Route } from 'react-router-dom';
import { POS } from '@/components/POS';
import { Home } from '@/components/Home';
import { TestSync } from '@/components/TestSync';
import { NotFound } from '@/components/NotFound';

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/test" element={<TestSync />} />
            <Route path="/pos" element={<POS />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
