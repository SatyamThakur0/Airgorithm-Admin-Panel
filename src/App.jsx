import { Routes, Route } from "react-router-dom";
import CountriesPage from "./components/Admin/Country";
import CitiesPage from "./components/Admin/City";
import AirportsPage from "./components/Admin/Airport";
import AirplanesPage from "./components/Admin/Airplane";
import FlightsPage from "./components/Admin/Flight";
import { Sidebar } from "./components/Admin/Sidebar";
import { useState } from "react";
import FlightCycle from "./components/Admin/FlightCycle";
import Login from "./components/Admin/Login";

function App() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [admin, setAdmin] = useState(null);
    return (
        <>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Sidebar
                            isCollapsed={isCollapsed}
                            onToggleCollapse={setIsCollapsed}
                            isMobileOpen={isMobileOpen}
                            onMobileToggle={setIsMobileOpen}
                            admin={admin}
                            setAdmin={setAdmin}
                        ></Sidebar>
                    }
                >
                    <Route path="/country" element={<CountriesPage />} />
                    <Route path="/city" element={<CitiesPage />} />
                    <Route path="/airport" element={<AirportsPage />} />
                    <Route path="/airplane" element={<AirplanesPage />} />
                    <Route path="/flight" element={<FlightsPage />} />
                    <Route path="/flight-cycle" element={<FlightCycle />} />
                </Route>
                <Route
                    path="/login"
                    element={<Login admin={admin} setAdmin={setAdmin} />}
                />
            </Routes>
        </>
    );
}

export default App;
