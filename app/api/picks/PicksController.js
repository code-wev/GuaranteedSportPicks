import { dbConnect } from "@/lib/dbConnect"
import { Pick } from "./PicksModel";

export const savePicks = async(data)=>{
    await dbConnect();
    const newPick = new Pick(data);
    const saved  = newPick.save();
    return saved
}


export const getAllPicksWithLiveOdds = async () => {
  const picks = await Pick.find({ status: "active" });

  const sports = [...new Set(picks.map(p => p.sport))];
  const liveOddsData = {};

  for (const sport of sports) {
    try {
      const response = await fetch(
        `https://api.the-odds-api.com/v4/sports/${sport}/odds?apiKey=99b82575306a98161eb8a397e6a99c14`
      );
      const data = await response.json();
      liveOddsData[sport] = Array.isArray(data) ? data : [];
    } catch (err) {
      console.error(`Error fetching odds for ${sport}:`, err);
      liveOddsData[sport] = [];
    }
  }

  const mergedPicks = picks.map(pick => {
    const liveSportData = liveOddsData[pick.sport] || [];
    const liveMatch = liveSportData.find(m => m.id === pick.eventId) || null;

    return {
      ...pick._doc,
      liveOdds: liveMatch ? liveMatch.bookmakers : null,
    };
  });

  return mergedPicks;
};

export const getPickWithLiveOddsById = async (pickId) => {
   await dbConnect()
  try {
    // 1️⃣ DB theke pick ane
    const pick = await Pick.findById(pickId);


    if (!pick) {
      throw new Error("Pick not found");
    }

    // 2️⃣ Live odds fetch
    let liveOdds = null;

    try {
      const response = await fetch(
        `https://api.the-odds-api.com/v4/sports/${pick.sport}/odds?apiKey=99b82575306a98161eb8a397e6a99c14`
      );
      const data = await response.json();

      const liveSportData = Array.isArray(data) ? data : [];
      const liveMatch = liveSportData.find((m) => m.id === pick.eventId) || null;

      if (liveMatch) {
        liveOdds = liveMatch.bookmakers;
      }
    } catch (err) {
      console.error(`Error fetching live odds for ${pick.sport}:`, err);
      liveOdds = null;
    }

    // 3️⃣ Merge and return
    return {
      ...pick._doc,
      liveOdds,
    };
  } catch (error) {
    console.error("Error fetching pick with live odds:", error);
    throw error;
  }
};



export const deletePick = async(id)=>{

    await dbConnect();

    const deleted = await Pick.deleteOne({_id:id});
    return deleted;
}

export const udpateStatus = async(id, status)=>{

    const updated = await Pick.updateOne({
        _id:id
    }, {$set:{
        status:status
    }});

    return updated;
    
}
export const udpateResult = async(id, result)=>{

    const updated = await Pick.updateOne({
        _id:id
    }, {$set:{
        result:result
    }});

    return updated;
    
}