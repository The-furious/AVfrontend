import { useEffect } from "react";

const useOnlineStatus = (stompClient, userId) => {
  useEffect(() => {
    const handleWindowClose = () => {
      if (stompClient) {
        const user = { userId: userId, status: 'OFFLINE' };
        stompClient.send("/app/topic/disconnectUser", {}, JSON.stringify(user));
        stompClient.disconnect(() => {
          console.log("Offline WebSocket disconnected");
        });
      }
    };

    window.addEventListener("beforeunload", handleWindowClose);

    return () => {
      window.removeEventListener("beforeunload", handleWindowClose);
    };
  }, [stompClient, userId]);
};

export default useOnlineStatus;
// useOnlineStatus(stompClient, userId);
