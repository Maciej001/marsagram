// Action types
const SET_ROVER = "SET_ROVER";
const SET_SOL = "SET_SOL";
const SET_CAMERAS = "SET_CAMERAS";
const SET_CAMERA = "SET_CAMERA";
const SET_PHOTOS = "SET_PHOTOS";
const IS_LOADING_CAMERAS = "IS_LOADING_CAMERAS";
const SET_MANIFEST_LOADING_ERROR = "SET_MANIFEST_LOADING_ERROR";

// Action creators
export const doSetRover = rover => ({
  type: SET_ROVER,
  rover
});

export const doSetSol = (sol, change) => ({
  type: SET_SOL,
  sol,
  change
});

export const doSetCameras = cameras => ({
  type: SET_CAMERAS,
  cameras
});

export const doSetCamera = camera => ({
  type: SET_CAMERA,
  camera
});

export const doSetPhotos = (photos, rover) => ({
  type: SET_PHOTOS,
  photos,
  rover
});

export const doIsLoadingCameras = isLoading => ({
  type: IS_LOADING_CAMERAS,
  isLoading
});

export const doSetManifestLoadingError = error => ({
  type: SET_MANIFEST_LOADING_ERROR,
  error
});

// Initial state
const initialState = {
  rovers: ["curiosity", "opportunity", "spirit"],
  activeRover: "curiosity",
  photos: {
    curiosity: [],
    opportunity: [],
    spirit: []
  },
  cameras: [],
  activeCamera: "",
  sol: 3,
  isLoadingCameras: false,
  manifestError: null
};

const appReducer = ( state=initialState, action ) => {
  switch (action.type) {
    case SET_ROVER:
      return {
      ...state,
      activeRover: action.rover
    }
    case SET_SOL:
      const requestedNextSol = action.sol + action.change;
      const nextSol = requestedNextSol >= 0 ?  requestedNextSol : state.sol;
      return {
        ...state,
        sol: nextSol
      };
    case SET_CAMERAS:
      return {
        ...state,
        cameras: action.cameras,
        activeCamera: action.cameras ? action.cameras[0] : ""
      }
    case SET_CAMERA:
      return {
        ...state,
        activeCamera: action.camera
      }
    case SET_PHOTOS:
      return {
        ...state,
        photos: {
          ...state.photos,
          [action.rover]: action.photos
        }
      }
    case IS_LOADING_CAMERAS:
      return {
        ...state,
        isLoadingCameras: action.isLoading
      }
    case SET_MANIFEST_LOADING_ERROR:
      return {
        ...state,
        manifestError: action.error
      }
    default:
      return state;
  }
}

export default appReducer;
