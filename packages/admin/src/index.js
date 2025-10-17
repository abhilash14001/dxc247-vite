import React, { Suspense, lazy } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ReduxProvider } from "@dxc247/shared/store/Provider";
import { SportsProvider } from "@dxc247/shared/components/providers/SportsProvider";
import { AuthProvider } from "@dxc247/shared/components/providers/AuthProvider";
import { CasinoProvider } from "@dxc247/shared/components/providers/CasinoProvider";
import { StakeProvider } from "@dxc247/shared/contexts/StakeContext";
import { CommonProvider } from "@dxc247/shared/components/providers/CommonProvider";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminRouteGuard from "./components/AdminRouteGuard";
import AdminLayout from "./layouts/AdminLayout";
import CricketLayout from "./layouts/CricketLayout";

// Lazy load pages
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/AdminUsers"));
const AdminReports = lazy(() => import("./pages/AdminReports"));
const AdminSettings = lazy(() => import("./pages/AdminSettings"));
const AdminCreateAccount = lazy(() => import("./pages/AdminCreateAccount"));
const AdminEditAccount = lazy(() => import("./pages/AdminEditAccount"));
const AdminDeletedUsers = lazy(() => import("./pages/AdminDeletedUsers"));
const AdminBets = lazy(() => import("./pages/AdminBets"));
const AdminTransactions = lazy(() => import("./pages/AdminTransactions"));
const AdminCasino = lazy(() => import("./pages/AdminCasino"));
const AdminCreateCasino = lazy(() => import("./pages/AdminCreateCasino"));
const AdminEditCasino = lazy(() => import("./pages/AdminEditCasino"));
const AdminSports = lazy(() => import("./pages/AdminSports"));
const AdminSportsList = lazy(() => import("./pages/AdminSportsList"));
const AdminSportsMarket = lazy(() => import("./pages/AdminSportsMarket"));
const AdminMatchHistory = lazy(() => import("./pages/AdminMatchHistory"));
const AdminManageFancy = lazy(() => import("./pages/AdminManageFancy"));
const AdminManageFancySingle = lazy(() => import("./pages/AdminManageFancySingle"));
const AdminFancyHistory = lazy(() => import("./pages/AdminFancyHistory"));
const AdminFancyHistorySingle = lazy(() => import("./pages/AdminFancyHistorySingle"));
const AdminCasinoMarket = lazy(() => import("./pages/AdminCasinoMarket"));
const AdminSiteConfiguration = lazy(() => import("./pages/AdminSiteConfiguration"));
const AdminManagePrivilege = lazy(() => import("./pages/AdminManagePrivilege"));
const AdminCreatePrivilege = lazy(() => import("./pages/AdminCreatePrivilege"));
const AdminEditPrivilege = lazy(() => import("./pages/AdminEditPrivilege"));
const AdminManagePrefix = lazy(() => import("./pages/AdminManagePrefix"));
const AdminCreateEditPrefix = lazy(() => import("./pages/AdminCreateEditPrefix"));
const AdminClientTrack = lazy(() => import("./pages/AdminClientTrack"));
const AdminCreateBlockIp = lazy(() => import("./pages/AdminCreateBlockIp"));
const AdminBlockIp = lazy(() => import("./pages/AdminBlockIp"));
const AdminBlockMarket = lazy(() => import("./pages/AdminBlockMarket"));
const AdminBannerManager = lazy(() => import("./pages/AdminBannerManager"));
const AdminCreateEditBanner = lazy(() => import("./pages/AdminCreateEditBanner"));
const AdminNotifications = lazy(() => import("./pages/AdminNotifications"));
const AdminLogs = lazy(() => import("./pages/AdminLogs"));
const AdminProfile = lazy(() => import("./pages/AdminProfile"));
const AdminChangePassword = lazy(() => import("./pages/AdminChangePassword"));
const AdminTransactionPassword = lazy(() => import("./pages/AdminTransactionPassword"));
const AdminTransactionPasswordSuccess = lazy(() => import("./pages/AdminTransactionPasswordSuccess"));
const AdminConfiguration = lazy(() => import("./pages/AdminConfiguration"));
const AdminUnauthorized = lazy(() => import("./pages/AdminUnauthorized"));
const CurrentBet = lazy(() => import("./pages/CurrentBet"));
const BetHistory = lazy(() => import("./pages/BetHistory"));
const DeletedBetHistory = lazy(() => import("./pages/DeletedBetHistory"));
const LineMarketBetHistory = lazy(() => import("./pages/LineMarketBetHistory"));
const CasinoResult = lazy(() => import("./pages/CasinoResult"));
const ClientProfitLoss = lazy(() => import("./pages/ClientProfitLoss"));
const SportsProfitLoss = lazy(() => import("./pages/SportsProfitLoss"));
const ProfitLossReports = lazy(() => import("./pages/ProfitLossReports"));
const MatchPL = lazy(() => import("./pages/MatchPL"));
const CasinoMain = lazy(() => import("@dxc247/shared/components/casino/CasinoMain"));
const Cricket = lazy(() => import("@dxc247/shared/components/sports/Cricket"));
const Tennis = lazy(() => import("@dxc247/shared/components/sports/Tennis"));
const Soccer = lazy(() => import("@dxc247/shared/components/sports/Soccer"));

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ReduxProvider>
      <CommonProvider>
        <SportsProvider>
          <Router>
            <AuthProvider>
              <CasinoProvider>
                <StakeProvider>
                <Suspense fallback={null}>
            <Routes>
              {/* Casino Route - Admin Route Condition */}
              <Route
                path="/admin/casino/:match_id"
                element={
                  
                    <AdminLayout>
                      <CasinoMain />
                    </AdminLayout>
                  
                }
              />
              
              {/* Cricket Route - Admin Route Condition */}
              <Route
                path="/admin/cricket/:match_id"
                element={
                  <AdminRouteGuard requiredPermission="sports">
                    <AdminLayout>
                      <CricketLayout>
                        <Cricket />
                      </CricketLayout>
                    </AdminLayout>
                  </AdminRouteGuard>
                }
              />
              
              {/* Tennis Route - Admin Route Condition */}
              <Route
                path="/admin/tennis/:match_id"
                element={
                  <AdminRouteGuard requiredPermission="sports">
                    <AdminLayout>
                      <Tennis />
                    </AdminLayout>
                  </AdminRouteGuard>
                }
              />
              
              {/* Soccer Route - Admin Route Condition */}
              <Route
                path="/admin/soccer/:match_id"
                element={
                  <AdminRouteGuard requiredPermission="sports">
                    <AdminLayout>
                      <Soccer />
                    </AdminLayout>
                  </AdminRouteGuard>
                }
              />
              
              {/* Login Routes */}
              <Route path="/login" element={<AdminLogin />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/unauthorized" element={<AdminUnauthorized />} />
              
              {/* Dashboard Routes */}
              <Route 
                path="/admin" 
                element={
                  <AdminRouteGuard requiredPermission="market-analysis">
                    <AdminLayout>
                      <AdminDashboard />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/" 
                element={
                  <AdminRouteGuard requiredPermission="market-analysis">
                    <AdminLayout>
                      <AdminDashboard />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/dashboard" 
                element={
                  <AdminRouteGuard requiredPermission="market-analysis">
                    <AdminLayout>
                      <AdminDashboard />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />

              {/* User Management Routes */}
              <Route 
                path="/admin/users" 
                element={
                  <AdminRouteGuard requiredPermission="client-list">
                    <AdminLayout>
                      <AdminUsers />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/users/:id" 
                element={
                  <AdminRouteGuard requiredPermission="client-list">
                    <AdminLayout>
                      <AdminUsers />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/client/create" 
                element={
                  <AdminRouteGuard requiredPermission="client-list">
                    <AdminLayout>
                      <AdminCreateAccount />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/client/edit/:userId" 
                element={
                  <AdminRouteGuard requiredPermission="client-list">
                    <AdminLayout>
                      <AdminEditAccount />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/client/deleted" 
                element={
                  <AdminRouteGuard requiredPermission="client-list">
                    <AdminLayout>
                      <AdminDeletedUsers />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />

              {/* Reports Routes */}
              <Route 
                path="/admin/reports/*" 
                element={
                  <AdminRouteGuard requiredPermission="reports">
                    <AdminLayout>
                      <AdminReports />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/reports/current-bet" 
                element={
                  <AdminRouteGuard requiredPermission="current-bet">
                    <AdminLayout>
                      <CurrentBet />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/reports/bet-history" 
                element={
                  <AdminRouteGuard requiredPermission="bet-history">
                    <AdminLayout>
                      <BetHistory />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/reports/deleted-bet-history" 
                element={
                  <AdminRouteGuard requiredPermission="deleted-bet-history">
                    <AdminLayout>
                      <DeletedBetHistory />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/reports/line-market-bet-history" 
                element={
                  <AdminRouteGuard requiredPermission="line-market-bet-history">
                    <AdminLayout>
                      <LineMarketBetHistory />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/reports/casino-result" 
                element={
                  <AdminRouteGuard requiredPermission="casino-result">
                    <AdminLayout>
                      <CasinoResult />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/reports/client-profit-loss" 
                element={
                  <AdminRouteGuard requiredPermission="client-p-l">
                    <AdminLayout>
                      <ClientProfitLoss />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/reports/sport-profit-loss" 
                element={
                  <AdminRouteGuard requiredPermission="sport-p-l">
                    <AdminLayout>
                      <SportsProfitLoss />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/reports/profit-loss" 
                element={
                  <AdminRouteGuard requiredPermission="profit-loss">
                    <AdminLayout>
                      <ProfitLossReports />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/reports/match-pl" 
                element={
                  <AdminRouteGuard requiredPermission="match-pl">
                    <AdminLayout>
                      <MatchPL />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />

              {/* Settings Routes */}
              <Route 
                path="/admin/settings/*" 
                element={
                  <AdminRouteGuard requiredPermission="settings">
                    <AdminLayout>
                      <AdminSettings />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/settings/sports-market" 
                element={
                  <AdminRouteGuard requiredPermission="sports-market">
                    <AdminLayout>
                      <AdminSportsMarket />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/settings/casino-market" 
                element={
                  <AdminRouteGuard requiredPermission="setting-casino-market">
                    <AdminLayout>
                      <AdminCasinoMarket />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/settings/match-history" 
                element={
                  <AdminRouteGuard requiredPermission="match-history">
                    <AdminLayout>
                      <AdminMatchHistory />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/settings/manage-fancy" 
                element={
                  <AdminRouteGuard requiredPermission="manage-fancy">
                    <AdminLayout>
                      <AdminManageFancy />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/settings/manage-fancy-single/:matchId" 
                element={
                  <AdminRouteGuard requiredPermission="manage-fancy">
                    <AdminLayout>
                      <AdminManageFancySingle />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/settings/fancy-history" 
                element={
                  <AdminRouteGuard requiredPermission="fancy-history">
                    <AdminLayout>
                      <AdminFancyHistory />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/settings/manage-fancy-history-single/:matchId" 
                element={
                  <AdminRouteGuard requiredPermission="fancy-history">
                    <AdminLayout>
                      <AdminFancyHistorySingle />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/settings/site-configuration" 
                element={
                  <AdminRouteGuard requiredPermission="site-configuration">
                    <AdminLayout>
                      <AdminSiteConfiguration />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/settings/multi-login" 
                element={
                  <AdminRouteGuard requiredPermission="manage-privilege">
                    <AdminLayout>
                      <AdminManagePrivilege />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/settings/multi-login/create" 
                element={
                  <AdminRouteGuard requiredPermission="manage-privilege">
                    <AdminLayout>
                      <AdminCreatePrivilege />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/settings/multi-login/:id/edit" 
                element={
                  <AdminRouteGuard requiredPermission="manage-privilege">
                    <AdminLayout>
                      <AdminEditPrivilege />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/settings/manage-prefix" 
                element={
                  <AdminRouteGuard requiredPermission="manage-prefix">
                    <AdminLayout>
                      <AdminManagePrefix />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/settings/manage-prefix/:id/edit" 
                element={
                  <AdminRouteGuard requiredPermission="manage-prefix">
                    <AdminLayout>
                      <AdminCreateEditPrefix />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/settings/manage-prefix/create" 
                element={
                  <AdminRouteGuard requiredPermission="manage-prefix">
                    <AdminLayout>
                      <AdminCreateEditPrefix />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              
              {/* Sports List Route */}
              <Route 
                path="/admin/sports/list/:sportType" 
                element={
                  <AdminRouteGuard requiredPermission="sports">
                    <AdminLayout>
                      <AdminSportsList />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              
              {/* User Detail Route */}
              <Route 
                path="/admin/users/:id" 
                element={
                  <AdminRouteGuard requiredPermission="client-list">
                    <AdminLayout>
                      <AdminUsers />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              
              {/* Bet Detail Route */}
              <Route 
                path="/admin/bets/:id" 
                element={
                  <AdminRouteGuard requiredPermission="bets">
                    <AdminLayout>
                      <AdminBets />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              
              {/* Casino Edit Route */}
              <Route 
                path="/admin/casinos/edit/:id" 
                element={
                  <AdminRouteGuard requiredPermission="casino">
                    <AdminLayout>
                      <AdminEditCasino />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              
              {/* User Edit Route */}
              <Route 
                path="/admin/client/edit/:userId" 
                element={
                  <AdminRouteGuard requiredPermission="client-list">
                    <AdminLayout>
                      <AdminEditAccount />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              
              {/* User Create Route */}
              <Route 
                path="/admin/client/create" 
                element={
                  <AdminRouteGuard requiredPermission="client-list">
                    <AdminLayout>
                      <AdminCreateAccount />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              
              {/* User Deleted Route */}
              <Route 
                path="/admin/client/deleted" 
                element={
                  <AdminRouteGuard requiredPermission="client-list">
                    <AdminLayout>
                      <AdminDeletedUsers />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/settings/block-market" 
                element={
                  <AdminRouteGuard requiredPermission="block-market">
                    <AdminLayout>
                      <AdminBlockMarket />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/settings/client-track" 
                element={
                  <AdminRouteGuard requiredPermission="client-tack">
                    <AdminLayout>
                      <AdminClientTrack />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/settings/banner-manager" 
                element={
                  <AdminRouteGuard requiredPermission="banner-manager">
                    <AdminLayout>
                      <AdminBannerManager />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/settings/banner-manager/create" 
                element={
                  <AdminRouteGuard requiredPermission="banner-manager">
                    <AdminLayout>
                      <AdminCreateEditBanner />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/settings/banner-manager/:id/edit" 
                element={
                  <AdminRouteGuard requiredPermission="banner-manager">
                    <AdminLayout>
                      <AdminCreateEditBanner />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/settings/block-ip" 
                element={
                  <AdminRouteGuard requiredPermission="block-ip">
                    <AdminLayout>
                      <AdminBlockIp />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/settings/block-ip/create" 
                element={
                  <AdminRouteGuard requiredPermission="block-ip">
                    <AdminLayout>
                      <AdminCreateBlockIp />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/settings/block-ip/:id/edit" 
                element={
                  <AdminRouteGuard requiredPermission="block-ip">
                    <AdminLayout>
                      <AdminCreateBlockIp />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />

              {/* Sports Routes */}
              <Route 
                path="/admin/sports" 
                element={
                  <AdminRouteGuard requiredPermission="sports">
                    <AdminLayout>
                      <AdminSports />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/sports/list/:sport" 
                element={
                  <AdminRouteGuard requiredPermission="sports">
                    <AdminLayout>
                      <AdminSportsList />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />

              {/* Casino Routes */}
              <Route 
                path="/admin/casinos" 
                element={
                  <AdminRouteGuard requiredPermission="casino">
                    <AdminLayout>
                      <AdminCasino />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/casino/create" 
                element={
                  <AdminRouteGuard requiredPermission="casino">
                    <AdminLayout>
                      <AdminCreateCasino />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/casinos/create" 
                element={
                  <AdminRouteGuard requiredPermission="casino">
                    <AdminLayout>
                      <AdminCreateCasino />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/casino/edit/:casinoId" 
                element={
                  <AdminRouteGuard requiredPermission="casino">
                    <AdminLayout>
                      <AdminEditCasino />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />

              {/* Transactions Routes */}
              <Route 
                path="/admin/transactions" 
                element={
                  <AdminRouteGuard requiredPermission="transactions">
                    <AdminLayout>
                      <AdminTransactions />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />

              {/* Profile Routes */}
              <Route 
                path="/admin/profile" 
                element={
                  <AdminRouteGuard requiredPermission="profile">
                    <AdminLayout>
                      <AdminProfile />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/change-password" 
                element={
                  <AdminRouteGuard requiredPermission="change-password">
                    <AdminLayout>
                      <AdminChangePassword />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/transaction-password" 
                element={
                  <AdminRouteGuard requiredPermission="transaction-password">
                    <AdminLayout>
                      <AdminTransactionPassword />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route 
                path="/admin/transaction-password-success" 
                element={
                  <AdminRouteGuard requiredPermission="transaction-password">
                    <AdminLayout>
                      <AdminTransactionPasswordSuccess />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />

              {/* Configuration Routes */}
              <Route 
                path="/admin/configuration" 
                element={
                  <AdminRouteGuard requiredPermission="configuration">
                    <AdminLayout>
                      <AdminConfiguration />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />

              {/* Notifications Routes */}
              <Route 
                path="/admin/notifications" 
                element={
                  <AdminRouteGuard requiredPermission="notifications">
                    <AdminLayout>
                      <AdminNotifications />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />

              {/* Logs Routes */}
              <Route 
                path="/admin/logs" 
                element={
                  <AdminRouteGuard requiredPermission="logs">
                    <AdminLayout>
                      <AdminLogs />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />

              {/* Fallback Route */}
              <Route 
                path="/admin/*" 
                element={
                  <AdminRouteGuard requiredPermission="market-analysis">
                    <AdminLayout>
                      <AdminDashboard />
                    </AdminLayout>
                  </AdminRouteGuard>
                } 
              />
              <Route path="/*" element={<AdminLogin />} />
            </Routes>
                </Suspense>
              </StakeProvider>
            </CasinoProvider>
          </AuthProvider>
        </Router>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        </SportsProvider>
      </CommonProvider>
    </ReduxProvider>
  </React.StrictMode>
);

console.log("✅ Admin rendered - Go to /login");
