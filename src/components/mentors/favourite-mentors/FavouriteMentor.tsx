import React from 'react'
import { FavoriteSelectType } from '../../../../lib/db/schema'
import MentorCard from '../reusable/MentorCard';


export type FavoriteMentorType = {
  id: string;
  createdAt: Date | null;
  studentId: string | null;
  mentorId: string | null;
  mentor: {
    createdAt: Date | null;
    updatedAt: Date | null;
    userId: string;
    bio: string | null;
    country: string | null;
    city: string | null;
    zipCode: string | null;
    phoneNumber: string | null;
    imageUrl: string | null;
    verifiedStatus: string | null;
    user: {
      id: string;
      name: string;
      email: string;
      image?: string | null;
      role: string;
    };
  };
};



export default function FavouriteMentor({FavouriteMentors}: {FavouriteMentors: FavoriteMentorType[]}) {
    console.log(FavouriteMentors)
return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {FavouriteMentors.map((fav) =>
        fav.mentor ? (
          <MentorCard key={fav.id} mentor={fav.mentor} />
        ) : null
      )}
    </div>
  );
}
