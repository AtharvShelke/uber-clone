import { View, Image, TextInput, FlatList, TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { useState, useRef } from "react";
import { icons } from "@/constants";
import { GoogleInputProps } from "@/types/type";

const locationIQApiKey = "pk.fc77cb0ee8dc4be1c67740ddd70c53cf";

interface LocationIQPrediction {
  place_id: string;
  display_name: string;
  display_place: string;
  display_address: string;
  lat: string;
  lon: string;
  address?: {
    name?: string;
    road?: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

const LocationIQTextInput = ({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
}: GoogleInputProps) => {
  const [searchText, setSearchText] = useState("");
  const [predictions, setPredictions] = useState<LocationIQPrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch autocomplete suggestions from LocationIQ
  const fetchPredictions = async (input: string) => {
    if (input.length < 2) {
      setPredictions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
  `https://api.locationiq.com/v1/autocomplete?key=${locationIQApiKey}&q=${encodeURIComponent(input)}&limit=10&dedupe=1&countrycodes=in`
);

      const data = await response.json();
      
      if (Array.isArray(data)) {
        setPredictions(data);
      }
    } catch (error) {
      console.error("Error fetching predictions:", error);
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (text: string) => {
    setSearchText(text);
    
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Set new timeout for debouncing
    timeoutRef.current = setTimeout(() => {
      fetchPredictions(text);
    }, 300);
  };

  const handleSelectPrediction = (prediction: LocationIQPrediction) => {
    // LocationIQ returns lat/lon directly in the autocomplete response
    handlePress({
      latitude: parseFloat(prediction.lat),
      longitude: parseFloat(prediction.lon),
      address: prediction.display_name,
    });
    
    // Clear predictions and input after selection
    setPredictions([]);
    setSearchText(prediction.display_place || prediction.display_name);
  };

  return (
    <View
      className={`flex flex-row items-center justify-center relative z-50 rounded-xl ${containerStyle}`}
    >
      <View className="w-full">
        {/* Search Input */}
        <View
          className="flex-row items-center rounded-full px-4 py-3 mx-5"
          style={{
            backgroundColor: textInputBackgroundColor || "white",
            shadowColor: "#d4d4d4",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <View className="justify-center items-center w-6 h-6 mr-3">
            <Image
              source={icon ? icon : icons.search}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </View>
          
          <TextInput
            className="flex-1 text-base font-semibold"
            placeholder={initialLocation ?? "Where do you want to go?"}
            placeholderTextColor="gray"
            value={searchText}
            onChangeText={handleTextChange}
            style={{
              backgroundColor: textInputBackgroundColor || "white",
            }}
          />

          {loading && (
            <ActivityIndicator size="small" color="#666" />
          )}
        </View>

        {/* Predictions List */}
        {predictions.length > 0 && (
          <View
            className="mx-5 mt-2 rounded-xl overflow-hidden"
            style={{
              backgroundColor: textInputBackgroundColor || "white",
              shadowColor: "#d4d4d4",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              maxHeight: 300,
            }}
          >
            <FlatList
              data={predictions}
              keyExtractor={(item, index) => `${item.place_id}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelectPrediction(item)}
                  className="px-4 py-3 border-b border-gray-100"
                >
                  <Text className="text-base font-semibold text-gray-900 mb-1">
                    {item.display_place || item.address?.name || "Unknown"}
                  </Text>
                  <Text className="text-sm text-gray-500" numberOfLines={1}>
                    {item.display_address || item.display_name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default LocationIQTextInput;
