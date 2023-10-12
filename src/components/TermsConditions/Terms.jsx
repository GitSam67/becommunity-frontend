import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Terms() {
  const [ticked, setTicked] = useState(false);
const navigate = useNavigate();
  const handleTick = (e) => {
    setTicked(e);
    // console.log(e);
  };
  const handleClick = ()=>{
    navigate("/chooseinterest")
  }
  return (
    <div className="bg-[#0F2A36] h-screen">
      <div className="px-6 pt-8 font-medium font-Inter text-white text-2xl">
        Terms and Conditions{" "}
        <span className="text-sm">(This will be done in no time)</span>{" "}
      </div>
      <div className="px-4 pt-4 font-Inter text-white">
        <p>
          We want you to get on board with some terms and conditions. This is
          strictly for the enhancement of your experience and platform. Less
          trouble, more fun. That's All.
        </p>
        <ol className="list-decimal">
          <li className="py-1">
            You are responsible for all of your actions on this platform.
          </li>
          <li className="py-1">
            Strict actions will be taken against bullies or anyone violating our
            community guidelines.
          </li>
          <li className="py-1">
            You must follow the community guidelines at all times.
          </li>
          <li className="py-1">
            Your content should adhere to our content policies, which include
            restrictions on hate speech, harassment, and inappropriate material.
          </li>
          <li className="py-1">
            We respect your privacy. No data is being used for any personal
            usage by anyone with the access.
          </li>
          <li className="py-1">
            By using this platform, you agree to abide by these terms and
            conditions. Failure to do so may result in account suspension or
            termination.
          </li>
        </ol>
      </div>
      <div className="text-white font-Inter pt-8">
        <input
          value={ticked}
          onChange={(e) => handleTick(e.target.checked)}
          className="ml-8"
          type="checkbox"
        />{" "}
        <span>
          I agree with all terms and conditions and ready to proceed with
          BeCommunity platform
        </span>
      </div>
      <div className="py-4">
        <button
          style={{ backgroundColor: ticked ? "#03C988" : "#08a36f" }}
          disabled={!ticked}
          className="rounded-[12px] mx-8 px-4 py-2 text-white font-Inter font-medium"
          onClick={handleClick}
        >
          <div>Proceed</div>
        </button>
      </div>
    </div>
  );
}

export default Terms;
