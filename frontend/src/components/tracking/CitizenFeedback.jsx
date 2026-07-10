import { useState } from "react";
import { Star, ThumbsUp, MessageCircle, Share2 } from "lucide-react";

export default function CitizenFeedback() {
  const [rating, setRating] = useState(0);
  const [liked, setLiked] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Your Feedback</h3>

      <div className="flex gap-1 mb-5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => setRating(n)}>
            <Star
              size={22}
              className={n <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}
            />
          </button>
        ))}
      </div>

      <div className="flex items-center gap-6 text-sm text-gray-600">
        <button
          onClick={() => setLiked((l) => !l)}
          className={`flex items-center gap-1.5 ${liked ? "text-blue-600" : ""}`}
        >
          <ThumbsUp size={16} className={liked ? "fill-blue-100" : ""} />
          Like
        </button>
        <button className="flex items-center gap-1.5">
          <MessageCircle size={16} />
          Comment
        </button>
        <button className="flex items-center gap-1.5">
          <Share2 size={16} />
          Share
        </button>
      </div>
    </div>
  );
}