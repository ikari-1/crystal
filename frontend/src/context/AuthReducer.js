//アクションに応じて状態(state)を更新する仕組み
const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        isFetching: true,
        error: false,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        isFetching: false,
        error: false,
      };
    case "LOGIN_ERROR":
      return {
        user: null,
        isFetching: false,
        error: action.payload,
      };
    case "UPDATE_SUCCESS":
      return {
        ...state,
        user: action.payload,
      };
    case "FOLLOW":
      return {
        ...state,
        user: {
          ...state.user,
          followings: [...state.user.following, action.payload],
        },
      };
    case "UNFOLLOW":
      return {
        ...state,
        user: {
          ...state.user,
          followings: state.user.followings.filter(
            (following) => following !== action.payload
          ),
        },
      };
    case "LOGOUT":
      return {
        user: null,
        isFetching: false,
        error: false,
      };

    default:
      return state;
  }
};

export default AuthReducer;