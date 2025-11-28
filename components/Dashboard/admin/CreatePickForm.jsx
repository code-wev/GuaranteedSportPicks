"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { FiCalendar, FiSearch, FiChevronDown, FiUpload, FiX, FiClock, FiEye } from "react-icons/fi";
import { AiFillStar } from "react-icons/ai";

export default function CreatePickForm() {
  const [odds, setOdds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedGame, setSelectedGame] = useState(null);
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [gameDate, setGameDate] = useState("");
  const [gameTime, setGameTime] = useState("");
  const [pickType, setPickType] = useState("Spread");
  const [bettingLine, setBettingLine] = useState("");
  const [oddsValue, setOddsValue] = useState("");
  const [units, setUnits] = useState("");
  const [showUnits, setShowUnits] = useState(false);
  const [analysis, setAnalysis] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  
  // Dropdown states
  const [homeTeamDropdown, setHomeTeamDropdown] = useState(false);
  const [awayTeamDropdown, setAwayTeamDropdown] = useState(false);
  const [sportDropdown, setSportDropdown] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch odds data on component mount
  useEffect(() => {
    const fetchOdds = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/odds.json`);
        console.log("API Response:", response?.data);
        setOdds(response?.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching odds:", error);
        setLoading(false);
      }
    };

    fetchOdds();
  }, []);

  // Image upload function to imgBB
  const uploadImageToImgBB = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      setUploading(true);
      const response = await axios.post(
        'https://api.imgbb.com/1/upload?key=737238cd1ca9db74fb6d8f10c246b68e',
        formData
      );
      
      if (response.data.success) {
        console.log("Image uploaded successfully:", response.data.data.url);
        return response.data.data.url;
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Handle banner image upload
  const handleBannerUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type and size
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('Image size should be less than 10MB');
      return;
    }

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setBannerPreview(previewUrl);
    setBannerImage(file);

    // Upload to imgBB
    const imageUrl = await uploadImageToImgBB(file);
    if (imageUrl) {
      console.log("Banner Image URL:", imageUrl);
    }
  };

  // Remove banner image
  const removeBannerImage = () => {
    setBannerImage(null);
    setBannerPreview("");
    if (bannerPreview) {
      URL.revokeObjectURL(bannerPreview);
    }
  };

  // Get unique sports from odds data
  const sports = [...new Set(odds.map(game => game.sport_title))];

  // Get games for selected sport
  const filteredGames = selectedSport 
    ? odds.filter(game => game.sport_title === selectedSport)
    : odds;

  // Get all teams from filtered games
  const allTeams = [...new Set(
    filteredGames.flatMap(game => [game.home_team, game.away_team])
  )].filter(team => team);

  // Handle game selection
  const handleGameSelect = (game) => {
    setSelectedGame(game);
    setHomeTeam(game.home_team);
    setAwayTeam(game.away_team);
    
    // Format date and time from commence_time
    const date = new Date(game.commence_time);
    const formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    setGameDate(formattedDate);
    
    const formattedTime = date.toTimeString().slice(0, 5); // HH:MM format
    setGameTime(formattedTime);
    
    // Set default odds from the first bookmaker
    if (game.bookmakers && game.bookmakers.length > 0) {
      const market = game.bookmakers[0].markets.find(m => m.key === 'h2h');
      if (market) {
        const favorite = market.outcomes.reduce((prev, current) => 
          prev.price < current.price ? prev : current
        );
        setOddsValue(favorite.price);
      }
    }
    
    setHomeTeamDropdown(false);
    setAwayTeamDropdown(false);
  };

  // Handle manual team input
  const handleManualTeamInput = (teamType, value) => {
    if (teamType === 'home') {
      setHomeTeam(value);
      setSelectedGame(null);
    } else {
      setAwayTeam(value);
      setSelectedGame(null);
    }
  };

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format time for display
  const formatTimeForDisplay = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let bannerUrl = "";
    if (bannerImage) {
      bannerUrl = await uploadImageToImgBB(bannerImage);
    }

    const pickData = {
      sport: selectedSport,
      homeTeam,
      awayTeam,
      gameDate: formatDateForDisplay(gameDate),
      gameTime: formatTimeForDisplay(gameTime),
      pickType,
      bettingLine,
      odds: oddsValue,
      units,
      showUnits,
      analysis,
      bannerImage: bannerUrl,
      scheduled: gameDate && gameTime,
      selectedGame: selectedGame ? selectedGame.id : null,
      timestamp: new Date().toISOString(),
      status: "active"
    };

    // Beautiful console output
    console.log("🎯 ===== PICK CREATED SUCCESSFULLY =====");
    console.log("📋 PICK DETAILS:");
    console.log("├─ Sport:", pickData.sport || "Not set");
    console.log("├─ Match:", `${pickData.awayTeam || "Away Team"} vs ${pickData.homeTeam || "Home Team"}`);
    console.log("├─ Date & Time:", `${pickData.gameDate} at ${pickData.gameTime}` || "Not set");
    console.log("├─ Pick Type:", pickData.pickType);
    console.log("├─ Betting Line:", pickData.bettingLine || "Not set");
    console.log("├─ Odds:", pickData.odds || "Not set");
    console.log("├─ Units:", pickData.units || "Not set");
    console.log("├─ Show Units Publicly:", pickData.showUnits ? "Yes" : "No");
    console.log("├─ Analysis Length:", pickData.analysis?.length || 0, "characters");
    console.log("├─ Banner Image:", pickData.bannerImage ? "✅ Uploaded" : "❌ Not uploaded");
    console.log("├─ Scheduled:", pickData.scheduled ? "✅ Yes" : "❌ No");
    console.log("├─ Selected Game ID:", pickData.selectedGame || "Manual entry");
    console.log("└─ Status:", pickData.status);
    console.log("🕒 Created at:", new Date().toLocaleString());
    console.log("=====================================");
    
    // Show detailed alert
    alert(`✅ Pick Created Successfully!\n\n📊 Summary:\n• ${pickData.awayTeam || "Away Team"} vs ${pickData.homeTeam || "Home Team"}\n• ${pickData.pickType} - ${pickData.bettingLine || "No line"}\n• ${pickData.units || 0} Units\n\nCheck console for complete details.`);
  };

  if (loading) {
    return (
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading odds data...</div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold text-gray-800">
        Create New Pick
      </h2>

      <form onSubmit={handleSubmit}>
        {/* Sport Selection */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Sport</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setSportDropdown(!sportDropdown)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-left text-gray-700 outline-none flex justify-between items-center hover:border-gray-400 transition-colors"
            >
              <span className={selectedSport ? "text-gray-900" : "text-gray-500"}>
                {selectedSport || "Select Sport"}
              </span>
              <FiChevronDown className={`transform transition-transform ${sportDropdown ? 'rotate-180' : ''}`} />
            </button>
            {sportDropdown && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {sports.map((sport, index) => (
                  <button
                    key={sport}
                    type="button"
                    onClick={() => {
                      setSelectedSport(sport);
                      setSportDropdown(false);
                      setSelectedGame(null);
                      setHomeTeam("");
                      setAwayTeam("");
                    }}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors ${
                      index === 0 ? 'rounded-t-lg' : ''
                    } ${index === sports.length - 1 ? 'rounded-b-lg' : ''} ${
                      selectedSport === sport ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{sport}</span>
                      {selectedSport === sport && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Game Selection */}
        {selectedSport && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Select from {selectedSport} Games</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {filteredGames.map(game => (
                <button
                  key={game.id}
                  type="button"
                  onClick={() => handleGameSelect(game)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedGame?.id === game.id 
                      ? 'border-blue-500 bg-blue-100 shadow-sm' 
                      : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">{game.away_team} vs {game.home_team}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {new Date(game.commence_time).toLocaleDateString()} • {new Date(game.commence_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* GRID */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

          {/* Away Team */}
          <div className="flex flex-col relative">
            <label className="text-sm font-medium text-gray-700">Away Team</label>
            <div className="relative">
              <input
                type="text"
                value={awayTeam}
                onChange={(e) => handleManualTeamInput('away', e.target.value)}
                onFocus={() => setAwayTeamDropdown(true)}
                placeholder="Select from API or type manually"
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <FiSearch className="absolute right-3 top-3 text-gray-500" />
            </div>
            {awayTeamDropdown && allTeams.length > 0 && (
              <div className="absolute z-20 w-full mt-14 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {allTeams
                  .filter(team => 
                    team.toLowerCase().includes(awayTeam.toLowerCase())
                  )
                  .map(team => (
                    <button
                      key={team}
                      type="button"
                      onClick={() => {
                        setAwayTeam(team);
                        setAwayTeamDropdown(false);
                        setSelectedGame(null);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      {team}
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Home Team */}
          <div className="flex flex-col relative">
            <label className="text-sm font-medium text-gray-700">Home Team</label>
            <div className="relative">
              <input
                type="text"
                value={homeTeam}
                onChange={(e) => handleManualTeamInput('home', e.target.value)}
                onFocus={() => setHomeTeamDropdown(true)}
                placeholder="Select from API or type manually"
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <FiSearch className="absolute right-3 top-3 text-gray-500" />
            </div>
            {homeTeamDropdown && allTeams.length > 0 && (
              <div className="absolute z-20 w-full mt-14 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {allTeams
                  .filter(team => 
                    team.toLowerCase().includes(homeTeam.toLowerCase())
                  )
                  .map(team => (
                    <button
                      key={team}
                      type="button"
                      onClick={() => {
                        setHomeTeam(team);
                        setHomeTeamDropdown(false);
                        setSelectedGame(null);
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      {team}
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Game Date with HTML5 Date Picker */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Game Date</label>
            <div className="relative">
              <input
                type="date"
                value={gameDate}
                onChange={(e) => setGameDate(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
              />
              <FiCalendar className="absolute right-3 top-3 text-gray-500" />
            </div>
          </div>

          {/* Game Time with HTML5 Time Picker */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Game Time</label>
            <div className="relative">
              <input
                type="time"
                value={gameTime}
                onChange={(e) => setGameTime(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
              />
              <FiCalendar className="absolute right-3 top-3 text-gray-500" />
            </div>
          </div>

          {/* Pick Type */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Pick Type</label>
            <select 
              value={pickType}
              onChange={(e) => setPickType(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="Spread">Spread</option>
              <option value="Moneyline">Moneyline</option>
              <option value="Total">Total</option>
              <option value="Prop">Prop Bet</option>
            </select>
          </div>

          {/* Betting Line */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Betting Line</label>
            <input
              type="text"
              value={bettingLine}
              onChange={(e) => setBettingLine(e.target.value)}
              placeholder="e.g., -3.5 , +150, o 45.5"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Odds */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Odds</label>
            <input
              type="text"
              value={oddsValue}
              onChange={(e) => setOddsValue(e.target.value)}
              placeholder="e.g., -110 , +150"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Units */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Units</label>
            <input
              type="number"
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              placeholder="1–5"
              min="1"
              max="5"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <div className="mt-2 flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={showUnits}
                onChange={(e) => setShowUnits(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
              />
              <span className="text-sm text-gray-600">Show units publicly</span>
            </div>
          </div>
        </div>

        {/* Picks Analysis */}
        <div className="mt-6">
          <label className="text-sm font-medium text-gray-700">Picks Analysis</label>

          {/* Toolbar */}
          <div className="mt-2 flex items-center gap-4 rounded-t-lg border border-b-0 border-gray-300 bg-gray-50 px-3 py-2 text-gray-600 text-sm">
            <button type="button" className="font-semibold hover:text-gray-800">B</button>
            <button type="button" className="italic hover:text-gray-800">I</button>
            <button type="button" className="underline hover:text-gray-800">U</button>
            <span>|</span>
            <button type="button" className="hover:text-gray-800">•</button>
            <button type="button" className="hover:text-gray-800">1.</button>
            <button type="button" className="hover:text-gray-800">⎘</button>
            <button type="button" className="hover:text-gray-800">⎋</button>
          </div>

          {/* Textarea */}
          <textarea
            value={analysis}
            onChange={(e) => setAnalysis(e.target.value)}
            placeholder="Write your detailed analysis and reasoning for this pick..."
            className="h-40 w-full rounded-b-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          ></textarea>
        </div>

        {/* Banner Upload */}
        <div className="mt-6">
          <label className="text-sm font-medium text-gray-700">Optional Pick Banner</label>

          {bannerPreview ? (
            <div className="mt-3 relative">
              <img 
                src={bannerPreview} 
                alt="Banner preview" 
                className="w-full h-40 object-cover rounded-xl border border-gray-300"
              />
              <button
                type="button"
                onClick={removeBannerImage}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
              >
                <FiX size={16} />
              </button>
              {uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
                  <div className="text-white">Uploading...</div>
                </div>
              )}
            </div>
          ) : (
            <label className="mt-3 flex h-40 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-center text-sm text-gray-600 cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerUpload}
                className="hidden"
              />
              <FiUpload className="text-2xl mb-2 text-gray-400" />
              <p>Click to upload banner image</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
            </label>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-between">
          <button 
            type="button"
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 rounded-lg bg-gray-600 px-6 py-2 text-white font-medium hover:bg-gray-700 transition-colors"
          >
            <FiEye size={16} />
            Preview
          </button>
          
          <button 
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create Pick
          </button>
        </div>
      </form>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Pick Preview</h3>
              <button 
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>
            
            {/* Pick Card Preview */}
            <div className="w-full bg-white rounded-xl shadow-md p-5">
              <div className="relative flex items-center justify-between mb-3">
                {/* Left team */}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">{awayTeam?.charAt(0)}</span>
                  </div>
                  <p className="font-semibold text-lg text-gray-800">{awayTeam || "Away Team"}</p>
                </div>

                <span className="text-gray-500 font-medium">VS</span>

                {/* Right team */}
                <div className="flex items-center space-x-2">
                  <p className="font-semibold text-lg text-gray-800">{homeTeam || "Home Team"}</p>
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold">{homeTeam?.charAt(0)}</span>
                  </div>
                </div>

                <span className="absolute -right-2 -top-2 text-sm bg-[#26AB68] text-white px-3 py-1 rounded-full">
                  Active
                </span>
              </div>

              {/* Details */}
              <div className="text-sm text-gray-700 mb-4 space-y-3">
                <div className="flex justify-between">
                  <div className="">
                    <p className="text-[#B1B4B1]">Game Date</p>
                    <p>{formatDateForDisplay(gameDate) || "Not set"}</p>
                  </div>
                  <div className="flex flex-col">
                    <p className="font-semibold text-[#B1B4B1]">Bet Type</p>
                    <p>{pickType}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="">
                    <p className="text-[#B1B4B1]">Time</p>
                    <p>{formatTimeForDisplay(gameTime) || "Not set"}</p>
                  </div>
                  <div className="">
                    <p className="font-semibold text-[#B1B4B1]">Odds</p>
                    <p>{oddsValue || "Not set"}</p>
                  </div>
                </div>

                {bettingLine && (
                  <div className="flex items-center justify-between">
                    <div className="">
                      <p className="text-[#B1B4B1]">Betting Line</p>
                      <p>{bettingLine}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Confidence */}
              <div className="mb-3">
                <p className="text-gray-700 font-semibold mb-1">Confidence</p>
                <div className="flex items-center space-x-1 text-[#B91C1C]">
                  {[1, 2, 3, 4, 5].slice(0, units).map((i) => (
                    <AiFillStar key={i} size={20} />
                  ))}
                  <p className="text-base text-gray-600 ml-2">{units || 0} Units</p>
                </div>
              </div>

              {/* Game Started */}
              <button className="w-full flex items-center justify-center space-x-2 bg-[#FFF3F3] text-[#B91C1C] py-2 rounded-lg mb-4 text-sm font-medium">
                <FiClock className="text-xl" />
                <span>Time remaining: Game Started</span>
              </button>

              {/* View Details */}
              <button className="w-full bg-[#B91C1C] hover:bg-red-700 text-white py-2 rounded-lg font-medium flex items-center justify-center space-x-2">
                <FiEye className="text-xl" />
                <span>View Details</span>
              </button>
            </div>

            <div className="flex justify-end mt-6">
              <button 
                onClick={() => setShowPreview(false)}
                className="rounded-lg bg-gray-600 px-6 py-2 text-white font-medium hover:bg-gray-700 transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}