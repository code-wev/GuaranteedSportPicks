"use client";

import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AiFillLock, AiOutlineLock } from "react-icons/ai";
import {
  FiActivity,
  FiBarChart2,
  FiCalendar,
  FiCheckCircle,
  FiChevronDown,
  FiEye,
  FiImage,
  FiSearch,
  FiTarget,
  FiTrendingUp,
  FiX,
} from "react-icons/fi";
import { GiBrain } from "react-icons/gi";

export default function CreatePickForm() {
  const [odds, setOdds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedGame, setSelectedGame] = useState(null);

  // Form state matching the schema
  const [formData, setFormData] = useState({
    // API-provided fields
    sportId: "",
    sportKey: "",
    sport_title: "",
    home_team: "",
    away_team: "",
    commence_time: "",
    odds: {
      home_team: 0,
      away_team: 0,
      draw: 0,
    },
    bookmakers: [],

    // Admin-provided fields
    selected_team: "",
    market_type: "",
    units: 1,
    confidence: "medium",
    writeup: "",
    premium: false,
    release_time: "",
    pickBanner: "",
  });

  // UI state
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const [homeTeamDropdown, setHomeTeamDropdown] = useState(false);
  const [awayTeamDropdown, setAwayTeamDropdown] = useState(false);
  const [sportDropdown, setSportDropdown] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("game");

  // Color palette from your components
  const colors = {
    primary: "#D32F2F", // Main red
    success: "#43A047", // Green for wins
    warning: "#FB8C00", // Orange for pending
    danger: "#E53935", // Dark red for losses
    lightRed: "#FFEBEE", // Light red background
    lightGreen: "#E8F5E9", // Light green background
    lightOrange: "#FFF3E0", // Light orange background
    border: "#E0E0E0", // Border color
    text: "#333333", // Main text
    textLight: "#757575", // Secondary text
  };

  // Fetch odds data on component mount
  useEffect(() => {
    const fetchOdds = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/odds.json`);
        setOdds(response?.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching odds:", error);
        setLoading(false);
      }
    };

    fetchOdds();
  }, []);

  // Image upload function
  const uploadImageToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const response = await axios.post(
        "https://api.imgbb.com/1/upload?key=737238cd1ca9db74fb6d8f10c246b68e",
        formData,
      );

      if (response.data.success) {
        return response.data.data.url;
      }
      return null;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Handle form field changes
  const handleFieldChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // Handle game selection from API
  const handleGameSelect = (game) => {
    setSelectedGame(game);

    const homeOdds =
      game.bookmakers?.[0]?.markets
        ?.find((m) => m.key === "h2h")
        ?.outcomes?.find((o) => o.name === game.home_team)?.price || 0;
    const awayOdds =
      game.bookmakers?.[0]?.markets
        ?.find((m) => m.key === "h2h")
        ?.outcomes?.find((o) => o.name === game.away_team)?.price || 0;
    const drawOdds =
      game.bookmakers?.[0]?.markets
        ?.find((m) => m.key === "h2h")
        ?.outcomes?.find((o) => o.name === "Draw")?.price || 0;

    setFormData({
      ...formData,
      sportId: game.id,
      sportKey: game.sport_key,
      sport_title: game.sport_title,
      home_team: game.home_team,
      away_team: game.away_team,
      commence_time: game.commence_time,
      odds: {
        home_team: homeOdds,
        away_team: awayOdds,
        draw: drawOdds,
      },
      bookmakers: game.bookmakers || [],
      release_time: new Date().toISOString(),
    });

    setHomeTeamDropdown(false);
    setAwayTeamDropdown(false);
  };

  // Handle banner upload
  const handleBannerUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image size should be less than 10MB");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setBannerPreview(previewUrl);
    setBannerImage(file);

    const imageUrl = await uploadImageToImgBB(file);
    if (imageUrl) {
      handleFieldChange("pickBanner", imageUrl);
    }
  };

  // Remove banner image
  const removeBannerImage = () => {
    setBannerImage(null);
    setBannerPreview("");
    handleFieldChange("pickBanner", "");
    if (bannerPreview) {
      URL.revokeObjectURL(bannerPreview);
    }
  };

  // Get unique sports
  const sports = [...new Set(odds.map((game) => game.sport_title))];

  // Get filtered games
  const filteredGames = selectedSport
    ? odds.filter((game) => game.sport_title === selectedSport)
    : odds;

  // Search games
  const searchedGames = searchTerm
    ? filteredGames.filter(
        (game) =>
          game.home_team.toLowerCase().includes(searchTerm.toLowerCase()) ||
          game.away_team.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : filteredGames;

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get confidence color
  const getConfidenceColor = (level) => {
    switch (level) {
      case "high":
        return {
          bg: colors.lightGreen,
          text: colors.success,
          border: colors.success,
        };
      case "medium":
        return {
          bg: colors.lightOrange,
          text: colors.warning,
          border: colors.warning,
        };
      case "low":
        return {
          bg: colors.lightRed,
          text: colors.danger,
          border: colors.danger,
        };
      default:
        return { bg: "#F5F5F5", text: colors.textLight, border: colors.border };
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const required = [
      "sport_title",
      "home_team",
      "away_team",
      "selected_team",
      "market_type",
      "units",
      "confidence",
      "writeup",
    ];
    const missing = required.filter((field) => !formData[field]);

    if (missing.length > 0) {
      alert(`Please fill in: ${missing.join(", ")}`);
      return;
    }

    // Console output
    console.log("🎯 ===== PICK CREATED =====");
    console.log(formData);

    alert(
      `✅ Pick Created Successfully!\n\n${formData.selected_team} - ${formData.units} units`,
    );
  };

  if (loading) {
    return (
      <div
        className='w-full rounded-2xl bg-white p-8 shadow-lg flex flex-col items-center justify-center h-96'
        style={{ borderColor: colors.border }}>
        <div className='relative'>
          <div
            className='w-16 h-16 border-4 rounded-full'
            style={{
              borderColor: `${colors.primary}20`,
              borderTopColor: colors.primary,
            }}></div>
        </div>
        <div
          className='mt-4 text-lg font-medium'
          style={{ color: colors.text }}>
          Loading odds data...
        </div>
        <div className='mt-1 text-sm' style={{ color: colors.textLight }}>
          Please wait
        </div>
      </div>
    );
  }

  return (
    <div
      className='w-full rounded-2xl bg-white p-8 shadow-lg'
      style={{ borderColor: colors.border }}>
      {/* Header with tabs */}
      <div className='mb-8'>
        <h2
          className='text-2xl font-bold mb-6'
          style={{ color: colors.primary }}>
          Create New Pick
        </h2>

        {/* Tab Navigation */}
        <div className='flex border-b' style={{ borderColor: colors.border }}>
          {[
            { id: "game", label: "Select Game", icon: FiTarget },
            { id: "details", label: "Pick Details", icon: FiTrendingUp },
            { id: "analysis", label: "Analysis", icon: GiBrain },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 text-sm font-medium transition-all border-b-2 ${
                activeTab === tab.id ? "" : "opacity-60"
              }`}
              style={{
                color: activeTab === tab.id ? colors.primary : colors.textLight,
                borderBottomColor:
                  activeTab === tab.id ? colors.primary : "transparent",
              }}>
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Tab 1: Game Selection */}
        {activeTab === "game" && (
          <div className='space-y-6'>
            {/* Sport Selection */}
            <div>
              <label
                className='text-sm font-medium mb-2 block'
                style={{ color: colors.text }}>
                Sport
              </label>
              <div className='relative'>
                <button
                  type='button'
                  onClick={() => setSportDropdown(!sportDropdown)}
                  className='w-full px-4 py-3 text-left bg-white border rounded-lg flex justify-between items-center'
                  style={{
                    borderColor: colors.border,
                    color: selectedSport ? colors.text : colors.textLight,
                  }}>
                  <span>{selectedSport || "Select a sport"}</span>
                  <FiChevronDown
                    className={sportDropdown ? "rotate-180" : ""}
                    style={{ color: colors.textLight }}
                  />
                </button>

                {sportDropdown && (
                  <div
                    className='absolute z-20 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto'
                    style={{ borderColor: colors.border }}>
                    {sports.map((sport) => (
                      <button
                        key={sport}
                        type='button'
                        onClick={() => {
                          setSelectedSport(sport);
                          setSportDropdown(false);
                        }}
                        className='w-full px-4 py-3 text-left hover:bg-gray-50'
                        style={{
                          color:
                            selectedSport === sport
                              ? colors.primary
                              : colors.text,
                        }}>
                        {sport}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Search Games */}
            {selectedSport && (
              <div>
                <label
                  className='text-sm font-medium mb-2 block'
                  style={{ color: colors.text }}>
                  Search Games
                </label>
                <div className='relative'>
                  <input
                    type='text'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder='Search by team name...'
                    className='w-full px-4 py-3 pl-12 bg-white border rounded-lg outline-none'
                    style={{ borderColor: colors.border, color: colors.text }}
                  />
                  <FiSearch
                    className='absolute left-4 top-1/2 transform -translate-y-1/2'
                    style={{ color: colors.textLight }}
                  />
                </div>
              </div>
            )}

            {/* Games List */}
            {selectedSport && (
              <div className='space-y-3 max-h-96 overflow-y-auto pr-2'>
                {searchedGames.map((game) => (
                  <button
                    key={game.id}
                    type='button'
                    onClick={() => handleGameSelect(game)}
                    className='w-full text-left p-4 border rounded-lg bg-white'
                    style={{
                      borderColor:
                        selectedGame?.id === game.id
                          ? colors.primary
                          : colors.border,
                      backgroundColor:
                        selectedGame?.id === game.id ? "#FFFFFF" : "white",
                    }}>
                    <div className='flex items-center justify-between mb-2'>
                      <div className='flex items-center gap-3'>
                        <div
                          className='w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold'
                          style={{ backgroundColor: colors.primary }}>
                          {game.away_team.charAt(0)}
                        </div>
                        <div>
                          <div
                            className='font-medium'
                            style={{ color: colors.text }}>
                            {game.away_team}
                          </div>
                          <div
                            className='text-xs'
                            style={{ color: colors.textLight }}>
                            Away
                          </div>
                        </div>
                      </div>
                      <div
                        className='font-bold'
                        style={{ color: colors.textLight }}>
                        VS
                      </div>
                      <div className='flex items-center gap-3'>
                        <div className='text-right'>
                          <div
                            className='font-medium'
                            style={{ color: colors.text }}>
                            {game.home_team}
                          </div>
                          <div
                            className='text-xs'
                            style={{ color: colors.textLight }}>
                            Home
                          </div>
                        </div>
                        <div
                          className='w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold'
                          style={{ backgroundColor: colors.primary }}>
                          {game.home_team.charAt(0)}
                        </div>
                      </div>
                    </div>
                    <div
                      className='flex items-center gap-2 text-sm'
                      style={{ color: colors.textLight }}>
                      <FiCalendar size={14} />
                      <span>{formatDate(game.commence_time)}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className='flex justify-end pt-4'>
              <button
                type='button'
                onClick={() => setActiveTab("details")}
                disabled={!selectedGame}
                className='px-8 py-3 rounded-lg text-white font-medium'
                style={{
                  backgroundColor: selectedGame
                    ? colors.primary
                    : colors.border,
                  opacity: selectedGame ? 1 : 0.5,
                }}>
                Continue to Details
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Pick Details */}
        {activeTab === "details" && (
          <div className='space-y-6'>
            {/* Selected Game Summary */}
            {selectedGame && (
              <div
                className='p-4 border rounded-lg'
                style={{
                  borderColor: colors.primary,
                  backgroundColor: `${colors.primary}08`,
                }}>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-sm' style={{ color: colors.textLight }}>
                    Selected Game:
                  </span>
                  <span
                    className='text-xs px-2 py-1 rounded-full'
                    style={{
                      backgroundColor: `${colors.primary}20`,
                      color: colors.primary,
                    }}>
                    Locked
                  </span>
                </div>
                <div className='font-medium' style={{ color: colors.text }}>
                  {formData.away_team} vs {formData.home_team}
                </div>
                <div
                  className='text-sm mt-1'
                  style={{ color: colors.textLight }}>
                  {formatDate(formData.commence_time)}
                </div>
              </div>
            )}

            {/* Select Team */}
            <div>
              <label
                className='text-sm font-medium mb-2 block'
                style={{ color: colors.text }}>
                Select Your Team
              </label>
              <div className='grid grid-cols-2 gap-4'>
                <button
                  type='button'
                  onClick={() =>
                    handleFieldChange("selected_team", formData.away_team)
                  }
                  className='p-4 border rounded-lg bg-white'
                  style={{
                    borderColor:
                      formData.selected_team === formData.away_team
                        ? colors.success
                        : colors.border,
                    backgroundColor:
                      formData.selected_team === formData.away_team
                        ? colors.lightGreen
                        : "white",
                  }}>
                  <div className='font-medium' style={{ color: colors.text }}>
                    {formData.away_team}
                  </div>
                  <div className='text-sm' style={{ color: colors.textLight }}>
                    Away Team
                  </div>
                  {formData.odds.away_team > 0 && (
                    <div
                      className='mt-2 font-bold'
                      style={{ color: colors.success }}>
                      +{formData.odds.away_team}
                    </div>
                  )}
                </button>
                <button
                  type='button'
                  onClick={() =>
                    handleFieldChange("selected_team", formData.home_team)
                  }
                  className='p-4 border rounded-lg bg-white'
                  style={{
                    borderColor:
                      formData.selected_team === formData.home_team
                        ? colors.success
                        : colors.border,
                    backgroundColor:
                      formData.selected_team === formData.home_team
                        ? colors.lightGreen
                        : "white",
                  }}>
                  <div className='font-medium' style={{ color: colors.text }}>
                    {formData.home_team}
                  </div>
                  <div className='text-sm' style={{ color: colors.textLight }}>
                    Home Team
                  </div>
                  {formData.odds.home_team > 0 && (
                    <div
                      className='mt-2 font-bold'
                      style={{ color: colors.success }}>
                      +{formData.odds.home_team}
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Market Type */}
            <div>
              <label
                className='text-sm font-medium mb-2 block'
                style={{ color: colors.text }}>
                Market Type
              </label>
              <div className='grid grid-cols-3 gap-3'>
                {[
                  { id: "moneyline", label: "Moneyline", icon: FiTrendingUp },
                  { id: "spread", label: "Spread", icon: FiBarChart2 },
                  { id: "totals", label: "Totals", icon: FiActivity },
                ].map((type) => (
                  <button
                    key={type.id}
                    type='button'
                    onClick={() => handleFieldChange("market_type", type.id)}
                    className='p-3 border rounded-lg bg-white capitalize'
                    style={{
                      borderColor:
                        formData.market_type === type.id
                          ? colors.primary
                          : colors.border,
                      backgroundColor:
                        formData.market_type === type.id
                          ? `${colors.primary}10`
                          : "white",
                    }}>
                    <type.icon
                      className='mx-auto text-xl mb-1'
                      style={{
                        color:
                          formData.market_type === type.id
                            ? colors.primary
                            : colors.textLight,
                      }}
                    />
                    <span
                      className='text-sm'
                      style={{
                        color:
                          formData.market_type === type.id
                            ? colors.primary
                            : colors.text,
                      }}>
                      {type.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Units & Confidence */}
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label
                  className='text-sm font-medium mb-2 block'
                  style={{ color: colors.text }}>
                  Units (1-5)
                </label>
                <div className='flex items-center gap-2'>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type='button'
                      onClick={() => handleFieldChange("units", num)}
                      className='w-10 h-10 border rounded-lg bg-white text-sm font-medium'
                      style={{
                        borderColor:
                          formData.units >= num
                            ? colors.warning
                            : colors.border,
                        backgroundColor:
                          formData.units >= num ? colors.lightOrange : "white",
                        color:
                          formData.units >= num
                            ? colors.warning
                            : colors.textLight,
                      }}>
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  className='text-sm font-medium mb-2 block'
                  style={{ color: colors.text }}>
                  Confidence
                </label>
                <select
                  value={formData.confidence}
                  onChange={(e) =>
                    handleFieldChange("confidence", e.target.value)
                  }
                  className='w-full px-4 py-3 border rounded-lg bg-white outline-none'
                  style={{ borderColor: colors.border, color: colors.text }}>
                  <option value='low' style={{ color: colors.danger }}>
                    🔴 Low Confidence
                  </option>
                  <option value='medium' style={{ color: colors.warning }}>
                    🟡 Medium Confidence
                  </option>
                  <option value='high' style={{ color: colors.success }}>
                    🟢 High Confidence
                  </option>
                </select>
              </div>
            </div>

            {/* Premium Toggle */}
            <div
              className='flex items-center justify-between p-4 border rounded-lg'
              style={{ borderColor: colors.border }}>
              <div className='flex items-center gap-3'>
                {formData.premium ? (
                  <AiFillLock size={20} style={{ color: colors.primary }} />
                ) : (
                  <AiOutlineLock
                    size={20}
                    style={{ color: colors.textLight }}
                  />
                )}
                <div>
                  <div className='font-medium' style={{ color: colors.text }}>
                    Premium Pick
                  </div>
                  <div className='text-sm' style={{ color: colors.textLight }}>
                    Only premium members can view
                  </div>
                </div>
              </div>
              <button
                type='button'
                onClick={() => handleFieldChange("premium", !formData.premium)}
                className='relative w-12 h-6 rounded-full'
                style={{
                  backgroundColor: formData.premium
                    ? colors.primary
                    : colors.border,
                }}>
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                    formData.premium ? "right-1" : "left-1"
                  }`}></div>
              </button>
            </div>

            <div className='flex justify-between pt-4'>
              <button
                type='button'
                onClick={() => setActiveTab("game")}
                className='px-6 py-3 border rounded-lg font-medium'
                style={{ borderColor: colors.border, color: colors.text }}>
                Back
              </button>
              <button
                type='button'
                onClick={() => setActiveTab("analysis")}
                disabled={!formData.selected_team || !formData.market_type}
                className='px-8 py-3 rounded-lg text-white font-medium'
                style={{
                  backgroundColor:
                    formData.selected_team && formData.market_type
                      ? colors.primary
                      : colors.border,
                  opacity:
                    formData.selected_team && formData.market_type ? 1 : 0.5,
                }}>
                Continue to Analysis
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Analysis & Media */}
        {activeTab === "analysis" && (
          <div className='space-y-6'>
            {/* Writeup */}
            <div>
              <label
                className='text-sm font-medium mb-2 flex justify-between'
                style={{ color: colors.text }}>
                <span>Writeup Analysis</span>
                <span style={{ color: colors.textLight }}>
                  ({formData.writeup.length}/2000)
                </span>
              </label>
              <textarea
                value={formData.writeup}
                onChange={(e) => handleFieldChange("writeup", e.target.value)}
                placeholder='Share your detailed analysis and reasoning...'
                className='w-full h-48 px-4 py-3 border rounded-lg bg-white outline-none resize-none'
                style={{ borderColor: colors.border, color: colors.text }}
                maxLength={2000}></textarea>
            </div>

            {/* Banner Upload */}
            <div>
              <label
                className='text-sm font-medium mb-2 block'
                style={{ color: colors.text }}>
                Pick Banner (Optional)
              </label>
              {bannerPreview ? (
                <div
                  className='relative border rounded-lg overflow-hidden'
                  style={{ borderColor: colors.border }}>
                  <img
                    src={bannerPreview}
                    alt='Banner'
                    className='w-full h-48 object-cover'
                  />
                  <button
                    type='button'
                    onClick={removeBannerImage}
                    className='absolute top-3 right-3 p-2 rounded-full text-white'
                    style={{ backgroundColor: colors.danger }}>
                    <FiX size={18} />
                  </button>
                  {uploading && (
                    <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
                      <div className='bg-white px-4 py-2 rounded-full text-sm font-medium'>
                        Uploading...
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <label
                  className='flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg bg-gray-50 cursor-pointer'
                  style={{ borderColor: colors.border }}>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={handleBannerUpload}
                    className='hidden'
                  />
                  <FiImage size={32} style={{ color: colors.textLight }} />
                  <p
                    className='mt-2 font-medium'
                    style={{ color: colors.text }}>
                    Click to upload banner
                  </p>
                  <p
                    className='text-xs mt-1'
                    style={{ color: colors.textLight }}>
                    PNG, JPG up to 10MB
                  </p>
                </label>
              )}
            </div>

            {/* Summary Card */}
            <div
              className='p-4 border rounded-lg'
              style={{
                borderColor: colors.primary,
                backgroundColor: `${colors.primary}08`,
              }}>
              <h4
                className='font-medium mb-3 flex items-center gap-2'
                style={{ color: colors.text }}>
                <FiEye style={{ color: colors.primary }} />
                Pick Summary
              </h4>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span style={{ color: colors.textLight }}>Match:</span>
                  <span className='font-medium' style={{ color: colors.text }}>
                    {formData.away_team} vs {formData.home_team}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span style={{ color: colors.textLight }}>Pick:</span>
                  <span
                    className='font-medium'
                    style={{ color: colors.success }}>
                    {formData.selected_team}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span style={{ color: colors.textLight }}>Market:</span>
                  <span
                    className='font-medium capitalize'
                    style={{ color: colors.text }}>
                    {formData.market_type}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span style={{ color: colors.textLight }}>Units:</span>
                  <span
                    className='font-medium'
                    style={{ color: colors.warning }}>
                    {formData.units} Units
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span style={{ color: colors.textLight }}>Confidence:</span>
                  <span
                    className='font-medium capitalize px-2 py-0.5 rounded-full'
                    style={{
                      backgroundColor: getConfidenceColor(formData.confidence)
                        .bg,
                      color: getConfidenceColor(formData.confidence).text,
                    }}>
                    {formData.confidence}
                  </span>
                </div>
              </div>
            </div>

            <div className='flex justify-between pt-4'>
              <button
                type='button'
                onClick={() => setActiveTab("details")}
                className='px-6 py-3 border rounded-lg font-medium'
                style={{ borderColor: colors.border, color: colors.text }}>
                Back
              </button>
              <div className='flex gap-3'>
                <button
                  type='button'
                  onClick={() => setShowPreview(true)}
                  className='px-6 py-3 border rounded-lg font-medium flex items-center gap-2'
                  style={{ borderColor: colors.border, color: colors.text }}>
                  <FiEye />
                  Preview
                </button>
                <button
                  type='submit'
                  className='px-8 py-3 rounded-lg text-white font-medium flex items-center gap-2'
                  style={{ backgroundColor: colors.success }}>
                  <FiCheckCircle />
                  Create Pick
                </button>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Preview Modal */}
      {showPreview && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div
            className='bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto'
            style={{ borderColor: colors.border }}>
            <div className='flex justify-between items-center mb-4'>
              <h3
                className='text-xl font-bold'
                style={{ color: colors.primary }}>
                Pick Preview
              </h3>
              <button
                onClick={() => setShowPreview(false)}
                className='p-2 rounded-full'
                style={{ color: colors.textLight }}>
                <FiX size={24} />
              </button>
            </div>

            {/* Premium Badge */}
            {formData.premium && (
              <div
                className='mb-4 p-3 rounded-lg flex items-center gap-2 text-white'
                style={{ backgroundColor: colors.primary }}>
                <AiFillLock />
                <span className='font-medium'>Premium Pick</span>
              </div>
            )}

            {/* Pick Card */}
            <div
              className='rounded-xl p-6 text-white'
              style={{ backgroundColor: "#1a1a1a" }}>
              {/* Banner Image */}
              {formData.pickBanner && (
                <div className='absolute inset-0 opacity-20'>
                  <Image
                    src={formData.pickBanner}
                    alt=''
                    className='w-full h-full object-cover'
                  />
                </div>
              )}

              {/* Content */}
              <div className='relative z-10'>
                {/* Teams */}
                <div className='flex items-center justify-between mb-6'>
                  <div className='text-center'>
                    <div
                      className='w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-2 mx-auto'
                      style={{ backgroundColor: colors.primary }}>
                      {formData.away_team?.charAt(0)}
                    </div>
                    <div className='font-bold text-sm'>
                      {formData.away_team}
                    </div>
                    <div className='text-xs opacity-60'>Away</div>
                  </div>
                  <div className='text-2xl font-bold opacity-60'>VS</div>
                  <div className='text-center'>
                    <div
                      className='w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-2 mx-auto'
                      style={{ backgroundColor: colors.primary }}>
                      {formData.home_team?.charAt(0)}
                    </div>
                    <div className='font-bold text-sm'>
                      {formData.home_team}
                    </div>
                    <div className='text-xs opacity-60'>Home</div>
                  </div>
                </div>

                {/* Pick Info */}
                <div className='bg-white bg-opacity-10 rounded-lg p-4 mb-4'>
                  <div className='flex justify-between items-center mb-3'>
                    <span className='opacity-80'>Your Pick</span>
                    <span
                      className='font-bold'
                      style={{ color: colors.success }}>
                      {formData.selected_team}
                    </span>
                  </div>
                  <div className='flex justify-between items-center mb-3'>
                    <span className='opacity-80'>Market</span>
                    <span className='font-medium capitalize'>
                      {formData.market_type}
                    </span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='opacity-80'>Confidence</span>
                    <span className='font-medium capitalize'>
                      {formData.confidence}
                    </span>
                  </div>
                </div>

                {/* Units */}
                <div className='flex items-center justify-between mb-4'>
                  <span className='opacity-80'>Units</span>
                  <div className='flex gap-1'>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <span
                        key={num}
                        style={{
                          color:
                            num <= formData.units ? colors.warning : "#404040",
                        }}>
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>

                {/* Game Time */}
                <div className='flex items-center gap-2 text-sm opacity-60 mb-4'>
                  <FiCalendar />
                  <span>{formatDate(formData.commence_time)}</span>
                </div>

                {/* Analysis Preview */}
                {formData.writeup && (
                  <div className='bg-white bg-opacity-5 rounded-lg p-4 mb-4'>
                    <p className='text-sm opacity-80 line-clamp-3'>
                      {formData.writeup}
                    </p>
                  </div>
                )}

                {/* View Details Button */}
                <button
                  className='w-full py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2'
                  style={{ backgroundColor: colors.primary }}>
                  <FiEye />
                  View Full Details
                </button>
              </div>
            </div>

            <div className='flex justify-end mt-4'>
              <button
                onClick={() => setShowPreview(false)}
                className='px-6 py-2 rounded-lg font-medium'
                style={{ backgroundColor: "#f0f0f0", color: colors.text }}>
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
