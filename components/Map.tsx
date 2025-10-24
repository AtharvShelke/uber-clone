import { icons } from "@/constants";
import { calculateRegion, generateMarkersFromData } from "@/lib/map";
import { useDriverStore, useLocationStore } from "@/store";
import { MarkerData } from "@/types/type";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

const DRIVERS = [
  {
    "id": 1,
    "driver_id": 1,
    "first_name": "James",
    "last_name": "Wilson",
    "profile_image_url": "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
    "car_image_url": "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
    "car_seats": 4,
    "rating": 4.80
  },
  {
    "id": 2,
    "driver_id": 2,
    "first_name": "David",
    "last_name": "Brown",
    "profile_image_url": "https://ucarecdn.com/6ea6d83d-ef1a-483f-9106-837a3a5b3f67/-/preview/1000x666/",
    "car_image_url": "https://ucarecdn.com/a3872f80-c094-409c-82f8-c9ff38429327/-/preview/930x932/",
    "car_seats": 5,
    "rating": 4.60
  },
  {
    "id": 3,
    "driver_id": 3,
    "first_name": "Michael",
    "last_name": "Johnson",
    "profile_image_url": "https://ucarecdn.com/0330d85c-232e-4c30-bd04-e5e4d0e3d688/-/preview/826x822/",
    "car_image_url": "https://ucarecdn.com/289764fb-55b6-4427-b1d1-f655987b4a14/-/preview/930x932/",
    "car_seats": 4,
    "rating": 4.70
  },
  {
    "id": 4,
    "driver_id": 4,
    "first_name": "Robert",
    "last_name": "Green",
    "profile_image_url": "https://ucarecdn.com/fdfc54df-9d24-40f7-b7d3-6f391561c0db/-/preview/626x417/",
    "car_image_url": "https://ucarecdn.com/b6fb3b55-7676-4ff3-8484-fb115e268d32/-/preview/930x932/",
    "car_seats": 4,
    "rating": 4.90
  }
]

const Map = () => {
  const {
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude
  } = useLocationStore();
  const { selectedDriver, setDrivers } = useDriverStore();
  const [marker, setMarker] = useState<MarkerData[]>([]);
  const region = calculateRegion({
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude
  })
  useEffect(() => {
    setDrivers(DRIVERS)
    if (Array.isArray(DRIVERS)) {
      if (!userLatitude || !userLongitude) {
        return;
      }
      const newMarkers = generateMarkersFromData({
        data: DRIVERS.map((driver) => ({
          driver_id: Number(driver.driver_id),
          first_name: driver.first_name,
          last_name: driver.last_name,
          profile_image_url: driver.profile_image_url,
          car_image_url: driver.car_image_url,
          car_seats: driver.car_seats,
          rating: Number(driver.rating),
        })),
        userLatitude,
        userLongitude,
      });
      setMarker(newMarkers)
    }
  }, [DRIVERS]);


  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      showsUserLocation
      userInterfaceStyle="light"
      showsPointsOfInterest={false}
      initialRegion={region}
    >
      {marker.map((mark)=>(
        <Marker
         key={mark.id}
        coordinate={{
          latitude:mark.latitude,
          longitude:mark.longitude,
        }} 
        title={mark.title}
        image={selectedDriver === mark.id ? icons.selectedMarker : icons.marker}
        >

        </Marker>
      ))}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
});

export default Map;
