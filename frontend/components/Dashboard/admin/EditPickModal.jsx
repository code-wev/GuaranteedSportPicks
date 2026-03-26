"use client";

import { useUpdatePicksMutation } from "@/feature/PicksApi";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AiFillLock, AiOutlineLock } from "react-icons/ai";
import {
  FiActivity,
  FiBarChart2,
  FiCalendar,
  FiCheckCircle,
  FiEye,
  FiImage,
  FiTrendingUp,
  FiX,
} from "react-icons/fi";

export default function EditPickModal({ pick, isOpen, onClose }) {
  const [updatePicks, { isLoading: isUpdating }] = useUpdatePicksMutation();
  const [formData, setFormData] = useState({
    selected_team: "",
    market_type: "",
    units: 1,
    confidence: "medium",
    writeup: "",
    premium: false,
    release_time: "",
    pickBanner: "",
    price: 0,
    status: "pending",
    result: "void",
  });

  const [bannerPreview, setBannerPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (pick) {
      setFormData({
        selected_team: pick.selected_team || "",
        market_type: pick.market_type || "",
        units: pick.units || 1,
        confidence: pick.confidence || "medium",
        writeup: pick.writeup || "",
        premium: pick.premium || false,
        release_time: pick.release_time || "",
        pickBanner: pick.pickBanner || "",
        price: pick.price || 0,
        status: pick.status || "pending",
        result: pick.result || "void",
      });
      setBannerPreview(pick.pickBanner || "");
    }
  }, [pick]);

  const colors = {
    primary: "#D32F2F",
    success: "#43A047",
    warning: "#FB8C00",
    danger: "#E53935",
    lightRed: "#FFEBEE",
    lightGreen: "#E8F5E9",
    lightOrange: "#FFF3E0",
    border: "#E0E0E0",
    text: "#333333",
    textLight: "#757575",
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const uploadImageToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const response = await axios.post(
        "https://api.imgbb.com/1/upload?key=737238cd1ca9db74fb6d8f10c246b68e",
        formData
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

  const handleBannerUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setBannerPreview(previewUrl);

    const imageUrl = await uploadImageToImgBB(file);
    if (imageUrl) {
      handleFieldChange("pickBanner", imageUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        id: pick._id,
        ...formData,
        units: Number(formData.units),
        price: Number(formData.price),
      };

      await updatePicks(payload).unwrap();
      alert("Pick updated successfully!");
      onClose();
    } catch (err) {
      console.error("Failed to update pick:", err);
      alert(err?.data?.message || "Failed to update pick");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-[#D32F2F]">Edit Pick</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <FiX size={24} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Status & Result */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold mb-2 block text-gray-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleFieldChange("status", e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#D32F2F] outline-none transition-all"
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="close">Close</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block text-gray-700">Result</label>
              <select
                value={formData.result}
                onChange={(e) => handleFieldChange("result", e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#D32F2F] outline-none transition-all"
              >
                <option value="void">Void</option>
                <option value="win">Win</option>
                <option value="loss">Loss</option>
              </select>
            </div>
          </div>

          {/* Selected Team */}
          <div>
            <label className="text-sm font-semibold mb-2 block text-gray-700">Selected Team</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleFieldChange("selected_team", pick.away_team)}
                className={`p-4 border rounded-xl transition-all ${
                  formData.selected_team === pick.away_team
                    ? "border-[#43A047] bg-[#E8F5E9] shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-bold text-gray-800">{pick.away_team}</div>
                <div className="text-xs text-gray-500">Away Team</div>
              </button>
              <button
                type="button"
                onClick={() => handleFieldChange("selected_team", pick.home_team)}
                className={`p-4 border rounded-xl transition-all ${
                  formData.selected_team === pick.home_team
                    ? "border-[#43A047] bg-[#E8F5E9] shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-bold text-gray-800">{pick.home_team}</div>
                <div className="text-xs text-gray-500">Home Team</div>
              </button>
            </div>
          </div>

          {/* Market Type */}
          <div>
            <label className="text-sm font-semibold mb-2 block text-gray-700">Market Type</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "moneyline", label: "Moneyline", icon: FiTrendingUp },
                { id: "spread", label: "Spread", icon: FiBarChart2 },
                { id: "totals", label: "Totals", icon: FiActivity },
              ].map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handleFieldChange("market_type", type.id)}
                  className={`p-3 border rounded-xl transition-all flex flex-col items-center gap-1 ${
                    formData.market_type === type.id
                      ? "border-[#D32F2F] bg-[#FFEBEE] text-[#D32F2F]"
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  <type.icon size={20} />
                  <span className="text-xs font-medium">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Units & Confidence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold mb-2 block text-gray-700">Units (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.units}
                onChange={(e) => handleFieldChange("units", e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#D32F2F] outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block text-gray-700">Confidence</label>
              <select
                value={formData.confidence}
                onChange={(e) => handleFieldChange("confidence", e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#D32F2F] outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Premium & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-xl border-gray-200">
              <div className="flex items-center gap-3">
                {formData.premium ? (
                  <AiFillLock className="text-[#D32F2F]" size={20} />
                ) : (
                  <AiOutlineLock className="text-gray-400" size={20} />
                )}
                <div>
                  <div className="font-semibold text-gray-800 text-sm">Premium</div>
                  <div className="text-[10px] text-gray-500">Subscribers only</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleFieldChange("premium", !formData.premium)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  formData.premium ? "bg-[#D32F2F]" : "bg-gray-200"
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                    formData.premium ? "right-1" : "left-1"
                  }`}
                />
              </button>
            </div>
            <div>
              <label className="text-sm font-semibold mb-2 block text-gray-700">Price ($)</label>
              <input
                type="number"
                step="0.01"
                disabled={!formData.premium}
                value={formData.price}
                onChange={(e) => handleFieldChange("price", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg outline-none transition-all ${
                  !formData.premium ? "bg-gray-50 opacity-50 cursor-not-allowed" : "focus:ring-2 focus:ring-[#D32F2F]"
                }`}
              />
            </div>
          </div>

          {/* Writeup */}
          <div>
            <label className="text-sm font-semibold mb-2 block text-gray-700">Analysis Writeup</label>
            <textarea
              value={formData.writeup}
              onChange={(e) => handleFieldChange("writeup", e.target.value)}
              className="w-full h-32 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#D32F2F] outline-none resize-none"
              placeholder="Detailed analysis..."
            />
          </div>

          {/* Banner */}
          <div>
            <label className="text-sm font-semibold mb-2 block text-gray-700">Pick Banner</label>
            <div className="flex items-start gap-4">
              {bannerPreview && (
                <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-gray-200">
                  <Image src={bannerPreview} alt="Banner" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setBannerPreview("");
                      handleFieldChange("pickBanner", "");
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                  >
                    <FiX size={12} />
                  </button>
                </div>
              )}
              <label className="flex-1 border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
                <FiImage className="text-gray-400 mb-1" size={24} />
                <span className="text-xs text-gray-500">{uploading ? "Uploading..." : "Click to upload"}</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-200 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="flex-1 px-6 py-3 bg-[#43A047] text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors shadow-lg shadow-green-100 flex items-center justify-center gap-2"
            >
              <FiCheckCircle />
              {isUpdating ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
