import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ReduxProvider } from "@dxc247/shared/store/Provider";
import { CommonProvider } from "@dxc247/shared/components/providers/CommonProvider";
import { SportsProvider } from "@dxc247/shared/components/providers/SportsProvider";
import { CasinoProvider } from "@dxc247/shared/components/providers/CasinoProvider";
import { StakeProvider } from "@dxc247/shared/contexts/StakeContext";
import { AuthProvider } from "@dxc247/shared/components/providers/AuthProvider";
import ProtectedRoute from "@dxc247/shared/components/ProtectedRoute";
import withPageLoading from "@dxc247/shared/components/hoc/withPageLoading";
import LiveModeGuard from "@dxc247/shared/components/middleware/LiveModeGuard";
import BlockUrlMiddleware from "@dxc247/shared/components/middleware/BlockUrlMiddleware";
import MaintenanceModeGuard from "@dxc247/shared/components/middleware/MaintenanceModeGuard";
import FaviconUpdater from "@dxc247/shared/components/FaviconUpdater";
import NavigationListener from "@dxc247/shared/components/NavigationListener";
import RouteChangeListener from "@dxc247/shared/components/RouteChangeListener";
import { UserThemeWrapper } from "@dxc247/shared/components/providers/ThemeProvider";
import CasinoMain from "@dxc247/shared/components/casino/CasinoMain";

// Lazy load pages
const Login = lazy(() => import("./pages/Login"));
const Home = lazy(() => import("./pages/Home"));
const Tennis = lazy(() => import("@dxc247/shared/components/sports/Tennis"));
const Cricket = lazy(() => import("@dxc247/shared/components/sports/Cricket"));
const Soccer = lazy(() => import("@dxc247/shared/components/sports/Soccer"));
const AccountStatement = lazy(() => import("./pages/AccountStatement"));
const BetHistories = lazy(() => import("./pages/BetHistories"));
const ProfitLossReport = lazy(() => import("./pages/ProfitLossReport"));
const CurrentBets = lazy(() => import("./pages/CurrentBets"));
const CasinoResultReport = lazy(() => import("./pages/CasinoResultReport"));
const AllCasinos = lazy(() => import("./pages/AllCasinos"));
const TransactionPasswordSuccess = lazy(() => import("./pages/TransactionPasswordSuccess"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));
const HomeTabPages = lazy(() => import("./pages/HomeTabPages"));
const FantasyGames = lazy(() => import("./pages/FantasyGames"));
const FantasyGame = lazy(() => import("./pages/FantasyGame"));
const Rules = lazy(() => import("./pages/Rules"));
const AviatorList = lazy(() => import("@dxc247/shared/components/AviatorList"));
const NotFound = lazy(() => import("./pages/NotFound"));
const MaintenanceMode = lazy(() => import("./pages/MaintenanceMode"));

// Wrap components with page loading
const HomeWithLoading = withPageLoading(Home);
const TennisWithLoading = withPageLoading(Tennis);
const CricketWithLoading = withPageLoading(Cricket);
const SoccerWithLoading = withPageLoading(Soccer);
const AccountStatementWithLoading = withPageLoading(AccountStatement);
const CurrentBetsWithLoading = withPageLoading(CurrentBets);
const ProfitLossWithLoading = withPageLoading(ProfitLossReport);
const BetHistoriesWithLoading = withPageLoading(BetHistories);
const CasinoResultWithLoading = withPageLoading(CasinoResultReport);
const CasinoMainWithLoading = withPageLoading(CasinoMain);
const AllCasinosWithLoading = withPageLoading(AllCasinos);
const HomeTabPagesWithLoading = withPageLoading(HomeTabPages);
const FantasyGamesWithLoading = withPageLoading(FantasyGames);
const FantasyGameWithLoading = withPageLoading(FantasyGame);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ReduxProvider>
      <CommonProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Suspense fallback={<div></div>}>
            <FaviconUpdater />
            <NavigationListener />
            <RouteChangeListener />
            <AuthProvider>
              <BlockUrlMiddleware>
                <LiveModeGuard>
                  <MaintenanceModeGuard>
                    <SportsProvider>
                      <StakeProvider>
                        <CasinoProvider>
                          <UserThemeWrapper>
                            <Routes>
                              <Route path="/maintenance" element={<MaintenanceMode />} />
                              <Route path="/login" element={<Login />} />
                              <Route path="/transaction-password" element={<TransactionPasswordSuccess />} />
                            <Route path="/*" element={
                              <ProtectedRoute>
                                <Routes>
                                  <Route path="/change-password" element={<ChangePassword />} />
                                  <Route path="/our/:which_casino" element={<AllCasinosWithLoading />} />
                                  <Route path="/" element={<HomeWithLoading />} />
                                  <Route path="/tennis/:match_id" element={<TennisWithLoading />} />
                                  <Route path="/game-list/:match" element={<HomeTabPagesWithLoading />} />
                                  <Route path="/fantasy" element={<FantasyGamesWithLoading />} />
                                  <Route path="/fantasy-list" element={<FantasyGameWithLoading />} />
                                  <Route path="/account-statement" element={<AccountStatementWithLoading />} />
                                  <Route path="/current-bets" element={<CurrentBetsWithLoading />} />
                                  <Route path="/profit-loss" element={<ProfitLossWithLoading />} />
                                  <Route path="/bet-history" element={<BetHistoriesWithLoading />} />
                                  <Route path="/rules" element={<Rules />} />
                                  <Route path="/casino-game-results" element={<CasinoResultWithLoading />} />
                                  <Route path="/aviator-list" element={<AviatorList />} />
                                  <Route path="/casino/:match_id" element={<CasinoMainWithLoading />} />
                                  <Route path="/soccer/:match_id" element={<SoccerWithLoading />} />
                                  <Route path="/cricket/:match_id" element={<CricketWithLoading />} />
                                  {/* 404 Not Found Route - Must be last */}
                                  <Route path="/*" element={<NotFound />} />
                                </Routes>
                              </ProtectedRoute>
                            } />
                          </Routes>
                        </UserThemeWrapper>
                      </CasinoProvider>
                    </StakeProvider>
                  </SportsProvider>
                </MaintenanceModeGuard>
              </LiveModeGuard>
            </BlockUrlMiddleware>
          </AuthProvider>
            

          </Suspense>
          <ToastContainer
            position="top-center"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </Router>
      </CommonProvider>
    </ReduxProvider>
  </React.StrictMode>
);

