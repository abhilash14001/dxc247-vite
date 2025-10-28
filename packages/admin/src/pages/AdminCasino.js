import React, { useState, useEffect } from "react";
import { adminApi } from '@dxc247/shared/utils/adminApi';
import DataTable from "react-data-table-component";
import { ADMIN_BASE_PATH } from "@dxc247/shared/utils/Constants";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faFilter,
  faDownload,
  faEye,
  faEdit,
  faPlay,
  faPause,
  faStop,
  faCog,
  faGamepad,
  faDollarSign,
  faUsers,
  faChartLine,
  faCalendarAlt,
  faToggleOn,
  faToggleOff,
  faTrash,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { gameNames } from "@dxc247/shared/utils/Constants";
import "./AdminCasino.css";
import { Link } from "react-router-dom";

function AdminCasino() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRows, setSelectedRows] = useState([]);
  const [showGameModal, setShowGameModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [showAddGameModal, setShowAddGameModal] = useState(false);

  useEffect(() => {
    loadGames();
  }, []);


  const loadGames = async () => {
    try {
      setLoading(true);
      
      
      // Use the new admin/get-casino-list API
      const response = await adminApi(`${ADMIN_BASE_PATH}/get-casino-list`, "GET", {}, true);
      
      if (response) {
        setGames(response || []);
      } else {
        console.error("Failed to load casino list:", response);
        setGames([]);
      }
    } catch (error) {
      console.error("Error loading casino list:", error);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  const getGameCategory = (gameId) => {
    if (gameId.includes("teen") || gameId.includes("patti"))
      return "Teen Patti";
    if (gameId.includes("ab") || gameId.includes("andar")) return "Andar Bahar";
    if (gameId.includes("dt") || gameId.includes("dragon"))
      return "Dragon Tiger";
    if (gameId.includes("baccarat")) return "Baccarat";
    if (gameId.includes("poker")) return "Poker";
    if (gameId.includes("lucky")) return "Lucky Games";
    if (gameId.includes("race")) return "Race Games";
    if (gameId.includes("card")) return "Card Games";
    if (gameId.includes("cricket")) return "Cricket Games";
    if (gameId.includes("superover")) return "Super Over";
    return "Other";
  };

  
  const handleViewGame = (game) => {
    setSelectedGame(game);
    setShowGameModal(true);
  };

  const handleEditGame = (game) => {
    setSelectedGame(game);
    setShowGameModal(true);
  };

  const handleToggleStatus = (gameId) => {
    setGames((prev) =>
      prev.map((game) =>
        game.gameId === gameId ? { ...game, isActive: !game.isActive } : game
      )
    );
  };

  const handleDeleteGame = (gameId) => {
    if (window.confirm("Are you sure you want to delete this game?")) {
      setGames((prev) => prev.filter((game) => game.gameId !== gameId));
    }
  };

  const handleAddGame = () => {
    setShowAddGameModal(true);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: "status-active",
      inactive: "status-inactive",
      maintenance: "status-maintenance",
      coming_soon: "status-coming-soon",
    };

    return (
      <span
        className={`status-badge ${statusClasses[status] || "status-default"}`}
      >
        {status.replace("_", " ")}
      </span>
    );
  };

  const getCategoryIcon = (category) => {
    const icons = {
      "Teen Patti": "fa-spade",
      "Andar Bahar": "fa-diamond",
      "Dragon Tiger": "fa-dragon",
      Baccarat: "fa-gem",
      Poker: "fa-club",
      "Lucky Games": "fa-star",
      "Race Games": "fa-flag-checkered",
      "Card Games": "fa-heart",
      "Cricket Games": "fa-baseball",
      "Super Over": "fa-trophy",
      Other: "fa-gamepad",
    };
    return icons[category] || "fa-gamepad";
  };

  const columns = [
    {
      name: "Game ID",
      selector: (row) => row.gameId,
      sortable: true,
      width: "120px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <div className="game-name-cell">
          <FontAwesomeIcon
            icon={getCategoryIcon(row.category)}
            className="game-icon"
          />
          <span>{row.name}</span>
        </div>
      ),
    },
    {
      name: "Category",
      selector: (row) => row.category,
      sortable: true,
      cell: (row) => <span className="category-badge">{row.category}</span>,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => getStatusBadge(row.status),
    },
    {
      name: "Min Bet",
      selector: (row) => row.minBet,
      sortable: true,
      cell: (row) => (
        <div className="bet-cell">
          <FontAwesomeIcon icon={faDollarSign} className="bet-icon" />
          <span>${row.minBet}</span>
        </div>
      ),
    },
    {
      name: "Max Bet",
      selector: (row) => row.maxBet,
      sortable: true,
      cell: (row) => (
        <div className="bet-cell">
          <FontAwesomeIcon icon={faDollarSign} className="bet-icon" />
          <span>${row.maxBet.toLocaleString()}</span>
        </div>
      ),
    },
    {
      name: "Commission",
      selector: (row) => row.commission,
      sortable: true,
      cell: (row) => (
        <span className="commission-cell">
          {(row.commission * 100).toFixed(1)}%
        </span>
      ),
    },
    {
      name: "Total Bets",
      selector: (row) => row.totalBets,
      sortable: true,
      cell: (row) => (
        <div className="stats-cell">
          <FontAwesomeIcon icon={faUsers} className="stats-icon" />
          <span>{row.totalBets}</span>
        </div>
      ),
    },
    {
      name: "Revenue",
      selector: (row) => row.totalRevenue,
      sortable: true,
      cell: (row) => (
        <div className="revenue-cell">
          <FontAwesomeIcon icon={faChartLine} className="revenue-icon" />
          <span>${row.totalRevenue.toLocaleString()}</span>
        </div>
      ),
    },
    {
      name: "Last Played",
      selector: (row) => row.lastPlayed,
      sortable: true,
      cell: (row) => (
        <div className="date-cell">
          <FontAwesomeIcon icon={faCalendarAlt} className="date-icon" />
          <span>{new Date(row.lastPlayed).toLocaleDateString()}</span>
        </div>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="action-buttons">
          <button
            className="btn btn-sm btn-outline"
            onClick={() => handleViewGame(row)}
            title="View Details"
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button
            className="btn btn-sm btn-outline"
            onClick={() => handleEditGame(row)}
            title="Edit Game"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            className={`btn btn-sm ${
              row.isActive ? "btn-warning" : "btn-success"
            }`}
            onClick={() => handleToggleStatus(row.gameId)}
            title={row.isActive ? "Deactivate" : "Activate"}
          >
            <FontAwesomeIcon icon={row.isActive ? faToggleOn : faToggleOff} />
          </button>
          <button
            className="btn btn-sm btn-danger"
            onClick={() => handleDeleteGame(row.gameId)}
            title="Delete Game"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "160px",
    },
  ];


  return (
    <div className="listing-grid">
      <div className="detail-row">
        <h2>Main Casino List</h2>
        <div className="row m-t-20">
          <div className="col-md-12">
            <div className="casino-list mt-2">
              {loading ? (
                <div className="text-center p-4">
                  <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                  <p className="mt-2">Loading casino games...</p>
                </div>
              ) : games.length > 0 ? (
                games.map((casino) => (
                  <div key={casino.id} className="casino-list-item position-relative">
                    <Link
                      to={`/casino/${casino.match_id.toLowerCase()}`}
                      className="position-relative d-block"
                    >
                      <div
                        className="casino-list-item-banner"
                        style={{
                          backgroundImage: `url('${casino.casino_image}')`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat'
                        }}
                      >
                       
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center p-4">
                  <p>No casino games available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCasino;
