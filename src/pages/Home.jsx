import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import openSocket from "socket.io-client";
let socket;

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

  useEffect(() => {
    if (window.localStorage != undefined) {
      const data = JSON.parse(localStorage.getItem("user"));
      if (data) {
        setUserInfo({
          adminEmail: data.email,
          shopId: data.shopId,
        });
        socket = openSocket(`${process.env.REACT_APP_API_URL}`);

        socket.on("connect", () => {
          socket.emit("join_room", { shopId: data.shopId });
        });

        socket.on("receiveOrders", (data) => {
          setLoading(true);
          setOrders(data.orders);
        });
      }
    }
  }, []);

  useEffect(() => {
    const handleAddOrder = (data) => {
      setOrders((prev) => [...prev, data.printableData]);
    };

    socket.on("addOrder", handleAddOrder);

    return () => {
      socket.off("addOrder", handleAddOrder);
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

      <div>
        {loading ? (
          <>
            {orders && orders.length !== 0 ? (
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
                  {orders.map((item) => (
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
                        <button className="btn btn-primary btn-sm">
                          Print
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="absolute w-full min-h-screen flex items-center justify-center">
                <p className="md:text-lg">No data found</p>
              </div>
            )}
          </>
        ) : (
          <div className=" min-h-screen w-full flex justify-center items-center bg-white">
            <div>
              <div className="spinner-border w-24 h-24" role="status">
                <span className="sr-only">Loading...</span>
              </div>
              <p className="text-lg font-bold md:text-xl mt-3">Loading..</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
