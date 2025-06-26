import React, { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Map, AlertCircle, CheckCircle } from 'lucide-react';

interface Location {
  latitude: number;
  longitude: number;
  address?: string;
}

interface LocationServiceProps {
  onLocationUpdate: (location: Location) => void;
  showMap?: boolean;
  currentLocation?: Location | null;
}

const LocationService: React.FC<LocationServiceProps> = ({
  onLocationUpdate,
  showMap = false,
  currentLocation
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [lastAttempt, setLastAttempt] = useState<Date | null>(null);
  const [isHttps, setIsHttps] = useState(false);

  useEffect(() => {
    // Check if we're running on HTTPS
    setIsHttps(window.location.protocol === 'https:' || window.location.hostname === 'localhost');

    // Check geolocation support and permission
    checkGeolocationSupport();
  }, []);

  const checkGeolocationSupport = async () => {
    console.log('Checking geolocation support...');

    if (!navigator.geolocation) {
      console.error('Geolocation not supported by browser');
      setHasPermission(false);
      return;
    }

    console.log('Geolocation is supported');

    // Check permission using Permissions API if available
    if (navigator.permissions) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        console.log('Geolocation permission status:', permission.state);

        setHasPermission(permission.state === 'granted');

        // Listen for permission changes
        permission.addEventListener('change', () => {
          console.log('Permission changed to:', permission.state);
          setHasPermission(permission.state === 'granted');
        });
      } catch (error) {
        console.error('Error checking geolocation permission:', error);
        setHasPermission(null);
      }
    } else {
      console.log('Permissions API not supported, will check on demand');
      setHasPermission(null);
    }
  };

  const requestLocation = async () => {
    console.log('Requesting location...');
    setIsLoading(true);
    setLastAttempt(new Date());

    // Check HTTPS requirement
    if (!isHttps) {
      toast({
        title: "Security Required",
        description: "Location services require a secure connection (HTTPS). Please access the site via HTTPS or localhost.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support location services",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    // Create a timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Location request timed out after 20 seconds'));
      }, 20000);
    });

    // Create geolocation promise
    const geolocationPromise = new Promise<GeolocationPosition>((resolve, reject) => {
      console.log('Calling navigator.geolocation.getCurrentPosition...');

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Geolocation success:', position);
          console.log('Coordinates:', position.coords.latitude, position.coords.longitude);
          console.log('Accuracy:', position.coords.accuracy);
          resolve(position);
        },
        (error) => {
          console.error('Geolocation error:', error);
          console.error('Error code:', error.code);
          console.error('Error message:', error.message);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });

    try {
      // Race between geolocation and timeout
      const position = await Promise.race([geolocationPromise, timeoutPromise]);

      const location: Location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };

      console.log('Location obtained:', location);

      // Try to get readable address using reverse geocoding
      try {
        console.log('Attempting reverse geocoding...');
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${location.latitude}&longitude=${location.longitude}&localityLanguage=en`
        );

        if (response.ok) {
          const data = await response.json();
          location.address = data.display_name || data.locality || data.city || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
          console.log('Reverse geocoding successful:', location.address);
        } else {
          console.warn('Reverse geocoding failed with status:', response.status);
          location.address = `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
        }
      } catch (error) {
        console.error('Reverse geocoding failed:', error);
        location.address = `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
      }

      setHasPermission(true);
      onLocationUpdate(location);

      toast({
        title: "Location updated",
        description: `Your location has been set to ${location.address}`
      });

    } catch (error: any) {
      console.error('Failed to get location:', error);

      let errorMessage = "Failed to get your location";
      let title = "Location Error";

      if (error.code) {
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            setHasPermission(false);
            title = "Permission Denied";
            errorMessage = "Location permission denied. Please allow location access in your browser settings to see nearby events.";
            break;
          case 2: // POSITION_UNAVAILABLE
            title = "Location Unavailable";
            errorMessage = "Location unavailable. Your device cannot determine your current position. Please try again or check your GPS settings.";
            break;
          case 3: // TIMEOUT
            title = "Request Timeout";
            errorMessage = "Location request timed out. Please try again with a better signal or connection.";
            break;
          default:
            errorMessage = `Location error: ${error.message}`;
        }
      } else if (error.message.includes('timeout')) {
        title = "Request Timeout";
        errorMessage = "Location request took too long. Please try again.";
      }

      toast({
        title,
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openInMaps = () => {
    if (!currentLocation) return;

    const { latitude, longitude } = currentLocation;
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  const retryLocation = () => {
    requestLocation();
  };

  if (!showMap) {
    return null; // This is a service component, no UI needed when not showing map
  }

  return (
    <Card data-id="3k01gkqm6" data-path="src/components/LocationService.tsx">
      <CardHeader data-id="99aarl1fj" data-path="src/components/LocationService.tsx">
        <CardTitle className="flex items-center gap-2" data-id="lnn6kvdmr" data-path="src/components/LocationService.tsx">
          <MapPin className="h-5 w-5" data-id="vv58gjwae" data-path="src/components/LocationService.tsx" />
          Location Services
        </CardTitle>
        <CardDescription data-id="4j4xqbxol" data-path="src/components/LocationService.tsx">
          Get your current location to find nearby events and opponents
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4" data-id="3l8ka5b8y" data-path="src/components/LocationService.tsx">
        {/* HTTPS Warning */}
        {!isHttps &&
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg" data-id="0elosheq2" data-path="src/components/LocationService.tsx">
            <div className="flex items-center gap-2 text-yellow-800" data-id="42oof4qim" data-path="src/components/LocationService.tsx">
              <AlertCircle className="h-4 w-4" data-id="e8jzwvegx" data-path="src/components/LocationService.tsx" />
              <p className="text-sm font-medium" data-id="cvxnruwgw" data-path="src/components/LocationService.tsx">Secure Connection Required</p>
            </div>
            <p className="text-sm text-yellow-700 mt-1" data-id="jpaujmt1r" data-path="src/components/LocationService.tsx">
              Location services require HTTPS. Please access this site via a secure connection.
            </p>
          </div>
        }

        {/* Control Buttons */}
        <div className="flex gap-2 flex-wrap" data-id="euw5tfa7w" data-path="src/components/LocationService.tsx">
          <Button
            onClick={requestLocation}
            disabled={isLoading || !isHttps}
            className="flex items-center gap-2" data-id="qsik4ps1m" data-path="src/components/LocationService.tsx">
            <Navigation className="h-4 w-4" data-id="10vkgt08d" data-path="src/components/LocationService.tsx" />
            {isLoading ? 'Getting Location...' : 'Get Current Location'}
          </Button>
          
          {currentLocation &&
          <Button
            variant="outline"
            onClick={openInMaps}
            className="flex items-center gap-2" data-id="8b30a4d03" data-path="src/components/LocationService.tsx">
              <Map className="h-4 w-4" data-id="5k02kj657" data-path="src/components/LocationService.tsx" />
              View on Map
            </Button>
          }

          {hasPermission === false && lastAttempt &&
          <Button
            variant="outline"
            onClick={retryLocation}
            disabled={isLoading}
            className="flex items-center gap-2" data-id="9f8zkcy49" data-path="src/components/LocationService.tsx">
              <Navigation className="h-4 w-4" data-id="v0yr1kpoo" data-path="src/components/LocationService.tsx" />
              Retry
            </Button>
          }
        </div>

        {/* Current Location Display */}
        {currentLocation &&
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg" data-id="ueczpppff" data-path="src/components/LocationService.tsx">
            <div className="flex items-center gap-2 mb-2" data-id="gv6ufqqp4" data-path="src/components/LocationService.tsx">
              <CheckCircle className="h-4 w-4 text-emerald-600" data-id="xvmb0yzqs" data-path="src/components/LocationService.tsx" />
              <span className="font-medium text-emerald-800" data-id="ya14b58of" data-path="src/components/LocationService.tsx">Current Location</span>
            </div>
            <p className="text-sm text-emerald-700 mb-2" data-id="z5lr5yqrx" data-path="src/components/LocationService.tsx">
              {currentLocation.address || 'Location coordinates available'}
            </p>
            <p className="text-xs text-emerald-600" data-id="5qilp5isw" data-path="src/components/LocationService.tsx">
              Lat: {currentLocation.latitude.toFixed(6)}, Lng: {currentLocation.longitude.toFixed(6)}
            </p>
          </div>
        }

        {/* Permission Denied Message */}
        {hasPermission === false &&
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg" data-id="jigx3bg16" data-path="src/components/LocationService.tsx">
            <div className="flex items-center gap-2 mb-2" data-id="ta8vb76o4" data-path="src/components/LocationService.tsx">
              <AlertCircle className="h-4 w-4 text-red-600" data-id="t1csqpfpi" data-path="src/components/LocationService.tsx" />
              <span className="font-medium text-red-800" data-id="zatikm4l1" data-path="src/components/LocationService.tsx">Location Access Denied</span>
            </div>
            <p className="text-sm text-red-700 mb-3" data-id="ma9smy7je" data-path="src/components/LocationService.tsx">
              To see nearby events and get directions, please enable location permissions:
            </p>
            <div className="space-y-2 text-xs text-red-600" data-id="lqbh4y9eo" data-path="src/components/LocationService.tsx">
              <div data-id="mdirz4d61" data-path="src/components/LocationService.tsx">
                <strong data-id="8fwwonmhm" data-path="src/components/LocationService.tsx">Chrome/Edge:</strong> Click the location icon 🔒 in the address bar, then select "Allow"
              </div>
              <div data-id="x139zhqpj" data-path="src/components/LocationService.tsx">
                <strong data-id="pyafkb5a9" data-path="src/components/LocationService.tsx">Firefox:</strong> Click the shield icon in the address bar, then allow location access
              </div>
              <div data-id="o0huga311" data-path="src/components/LocationService.tsx">
                <strong data-id="clxe6ewdk" data-path="src/components/LocationService.tsx">Safari:</strong> Go to Preferences → Websites → Location and allow access
              </div>
              <div data-id="p0u6fl3ik" data-path="src/components/LocationService.tsx">
                <strong data-id="zybv6dgdi" data-path="src/components/LocationService.tsx">Mobile:</strong> Check your browser and device location settings
              </div>
            </div>
            <Button
            size="sm"
            variant="outline"
            onClick={retryLocation}
            disabled={isLoading}
            className="mt-3" data-id="65jm48mc7" data-path="src/components/LocationService.tsx">
              Try Again
            </Button>
          </div>
        }

        {/* Browser Support Info */}
        {!navigator.geolocation &&
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg" data-id="pz1n9n92x" data-path="src/components/LocationService.tsx">
            <div className="flex items-center gap-2 mb-2" data-id="oxcj3t7ob" data-path="src/components/LocationService.tsx">
              <AlertCircle className="h-4 w-4 text-gray-600" data-id="zi1mqw2dj" data-path="src/components/LocationService.tsx" />
              <span className="font-medium text-gray-800" data-id="q7m5pau24" data-path="src/components/LocationService.tsx">Geolocation Not Supported</span>
            </div>
            <p className="text-sm text-gray-600" data-id="e8b7ac9o9" data-path="src/components/LocationService.tsx">
              Your browser doesn't support location services. Please update your browser or manually enter your location.
            </p>
          </div>
        }

        {/* Interactive Map Placeholder */}
        {currentLocation &&
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4" data-id="a0k1jzgev" data-path="src/components/LocationService.tsx">
            <h4 className="font-medium text-blue-900 mb-2" data-id="xgeyw2zwa" data-path="src/components/LocationService.tsx">Location Preview</h4>
            <div className="bg-white border rounded h-40 flex items-center justify-center" data-id="sepb6ty7n" data-path="src/components/LocationService.tsx">
              <div className="text-center text-gray-500" data-id="1bbmt5v6q" data-path="src/components/LocationService.tsx">
                <Map className="h-8 w-8 mx-auto mb-2" data-id="cg4f5lnpn" data-path="src/components/LocationService.tsx" />
                <p className="text-sm" data-id="oagetc6hu" data-path="src/components/LocationService.tsx">Interactive map integration</p>
                <p className="text-xs" data-id="tejnja8te" data-path="src/components/LocationService.tsx">Click "View on Map" to see full details</p>
              </div>
            </div>
          </div>
        }

        {/* Debug Info (only in development) */}
        {process.env.NODE_ENV === 'development' &&
        <div className="p-3 bg-gray-100 rounded text-xs text-gray-600" data-id="7c66ekd90" data-path="src/components/LocationService.tsx">
            <div data-id="769ivohfa" data-path="src/components/LocationService.tsx">HTTPS: {isHttps ? '✅' : '❌'}</div>
            <div data-id="gk36fq5yb" data-path="src/components/LocationService.tsx">Geolocation API: {navigator.geolocation ? '✅' : '❌'}</div>
            <div data-id="fobqce0h4" data-path="src/components/LocationService.tsx">Permission: {hasPermission === null ? 'Unknown' : hasPermission ? 'Granted' : 'Denied'}</div>
            {lastAttempt && <div data-id="o4al5cmhr" data-path="src/components/LocationService.tsx">Last attempt: {lastAttempt.toLocaleTimeString()}</div>}
          </div>
        }
      </CardContent>
    </Card>);

};

export default LocationService;

// Utility function to calculate distance between two points
export const calculateDistance = (
lat1: number,
lon1: number,
lat2: number,
lon2: number)
: number => {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
  Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
  Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};