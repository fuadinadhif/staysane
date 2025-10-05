"use client";

import React from "react";
import usePropertyDetails from "@/hooks/usePropertyDetails";
import { HeaderBlock } from "./components/HeaderBlock";
import { ImageGallery } from "./components/ImageGallery";
import { StatsHeader } from "./components/StatsHeader";
import { getGuestRange } from "@/components/tenant/property-utils";
import { AmenitiesSection } from "./components/AmenitiesSection";
import { Reviews } from "./components/Reviews";
import { BookingSidebar } from "./components/BookingSidebar";
import { RoomsSection } from "./components/RoomsSection";
import { LocationSection } from "./components/LocationSection";
import type { Room } from "@/types/property-detail";

export function PropertyDetailClient({ slug }: { slug: string }) {
  const {
    data: property,
    isLoading,
    error,
    selectedRoom,
    setSelectedRoom,
    unavailableDates,
  } = usePropertyDetails(slug);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Failed to load property</div>;
  if (!property) return <div>Property not found</div>;

  const images = property.Pictures?.map((p) => p.imageUrl) ?? [];

  const reviewCount = Number(property.reviewCount);
  const rating =
    property.Reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviewCount;

  const reviewsToShow = (property.Reviews ?? []).map((rv) => ({
    id: rv.id,
    author:
      [rv.User.firstName, rv.User.lastName].filter(Boolean).join(" ") ||
      "Anonymous",
    avatar: rv.User.image || "",
    rating: rv.rating,
    date: rv.createdAt,
    comment: rv.comment,
  }));

  const details = { reviews: reviewsToShow };
  const totalBedrooms = property.Rooms?.length || 1;
  const totalBeds =
    property.Rooms?.reduce((sum, room) => sum + (room.bedCount || 0), 0) || 0;
  type PropLike = { Rooms?: unknown[]; maxGuests?: number };
  const guestRange = getGuestRange(property as PropLike);

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <HeaderBlock name={property.name} />
      <ImageGallery name={property.name} images={images} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
        <div className="lg:col-span-2">
          <StatsHeader
            city={property.city}
            address={property.address}
            description={property.description}
            rating={rating}
            reviewCount={reviewCount}
            minGuests={guestRange.min}
            maxGuests={guestRange.max}
            bedrooms={totalBedrooms}
            totalBeds={totalBeds}
          />
          <div className="space-y-12">
            <AmenitiesSection
              property={{
                id: property.id,
                name: property.name,
                city: property.city,
                address: property.address,
                facilities: property.Facilities?.map((f) => ({
                  id: f.id,
                  propertyId: f.propertyId,
                  facility: f.facility,
                })),
              }}
            />
            <div className="border-t border-gray-100 pt-8">
              <RoomsSection
                rooms={property.Rooms || []}
                selectedRoomId={selectedRoom?.id}
                onRoomSelect={handleRoomSelect}
              />
            </div>
            <div className="border-t border-gray-100 pt-8">
              <LocationSection
                address={property.address}
                city={property.city}
                latitude={
                  property.latitude === undefined || property.latitude === null
                    ? undefined
                    : Number(property.latitude as unknown)
                }
                longitude={
                  property.longitude === undefined ||
                  property.longitude === null
                    ? undefined
                    : Number(property.longitude as unknown)
                }
              />
            </div>
            <div className="border-t border-gray-100 pt-8">
              <Reviews reviews={details.reviews} total={reviewCount} />
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <BookingSidebar
              pricePerNight={Number(property.Rooms?.[0]?.basePrice ?? 0)}
              maxGuests={guestRange.max}
              propertyId={property.id}
              selectedRoom={selectedRoom}
              unavailableDates={unavailableDates}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetailClient;
