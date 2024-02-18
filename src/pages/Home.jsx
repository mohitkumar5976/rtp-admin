import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import openSocket from "socket.io-client";
let socket = openSocket(`${process.env.REACT_APP_API_URL}`);

const Home = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    adminEmail: "",
    shopId: "",
  });

  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.removeItem("user");
    navigate("/login");
    socket.disconnect();
  };

  const loadData = () => {
    socket.emit("getOrders", { shopId: userInfo.shopId });
    socket.on("receiveOrders", (data) => {
      setOrders(data.orders);
    });
    setLoading(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = JSON.parse(localStorage.getItem("user"));

      if (data) {
        setUserInfo({
          adminEmail: data.email,
          shopId: data._id,
        });
        socket.emit("join_room", { shopId: data._id });
      }
    };

    fetchData();
    return () => {
      socket.off("receiveOrders");
    };
  }, []);

  useEffect(() => {
    socket.on("addOrder", (data) => {
      setOrders((prev) => [data.printableData, ...prev]);
    });

    return () => {
      socket.off("addOrder");
    };
  }, [socket]);

  let i = 1;
  return (
    <>
      <div className="flex justify-between p-2 items-center bg-black text-white">
        <span className="md:text-xl">RTP-Printing</span>
        <div className="flex items-center gap-x-5">
          <span>{userInfo.adminEmail}</span>
          <button className="btn btn-primary" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>

      {loading ? (
        <div>
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">S.no</th>
                <th scope="col">Docs</th>
                <th scope="col">Phone</th>
                <th scope="col">Pages</th>
                <th scope="col">Page format</th>
                <th scope="col">GrayOrColour</th>
                <th scope="col">Copies</th>
                <th scope="col">PageSide</th>
                <th scope="col">Order Id</th>
                <th scope="col">Payment Id</th>
                <th scope="col">Amount</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders && orders.length !== 0 ? (
                orders.map((item) => (
                  <tr key={item._id}>
                    <th scope="row">{i++}</th>
                    <td>
                      <Link to={`${item.docUrl}`}>View</Link>
                    </td>
                    <td>{item.phoneNo}</td>
                    <td>{item.noOfPages}</td>
                    <td>{item.pageSizeFormat}</td>
                    <td>{item.grayOrColored}</td>
                    <td>{item.noOfCopies}</td>
                    <td>{item.pageSides}</td>
                    <td>{item.order_id}</td>
                    <td>{item.payment_id}</td>
                    <td>{item.amount}</td>
                    <td>
                      <button className="btn btn-primary btn-sm">Print</button>
                    </td>
                  </tr>
                ))
              ) : (
                <>
                  <div className="min-h-screen flex items-center justify-center">
                    <p className="md:text-lg">No data found</p>
                  </div>
                </>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <div className="min-h-screen flex items-center justify-center">
            <button className="btn btn-primary" onClick={loadData}>
              Load data
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
