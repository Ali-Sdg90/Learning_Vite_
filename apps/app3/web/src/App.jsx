import axios from "axios";

const App = () => {
    const getReq = async () => {
        try {
            const res = await axios.get("/api/tasks");

            console.log("GET >>", res.data);
        } catch (error) {
            console.log("ERROR >>", error);
        }
    };

    const postReq = async () => {
        try {
            const res = await axios.post("/api/tasks", {
                data: {
                    title: "New Task",
                    done: true,
                    createdAt: Date.now(),
                },
            });

            console.log("POST >>", res.data);
        } catch (error) {
            console.log("ERROR >>", error);
        }
    };

    const postIDReq = async (id) => {
        try {
            const res = await axios.get(`/api/tasks/${id}`);

            console.log("GET-ID >>", res.data);
        } catch (error) {
            console.log("ERROR >>", error);
        }
    };

    const patchReq = async (id, title) => {
        try {
            const res = await axios.patch(`/api/tasks/${id}`, {
                data: { title },
            });

            console.log("PATCH >>", res.data);
        } catch (error) {
            console.log("ERROR >>", error);
        }
    };

    const deleteReq = async (id) => {
        try {
            const res = await axios.delete(`api/tasks/${id}`);

            console.log(res.data);
        } catch (error) {
            console.log("ERROR >>", error);
        }
    };

    return (
        <div className="items">
            <h1>Welcome to App 3</h1>

            <button onClick={getReq}>GET</button>

            <button onClick={postReq}>POST</button>

            <button onClick={() => postIDReq(3)}>POST ID: 3</button>

            <button onClick={() => patchReq(2, "Rick")}>
                PATCH ID: 2<br />
                title: Rick
            </button>

            <button onClick={() => deleteReq(3)}>DELETE ID: 3</button>
        </div>
    );
};

export default App;
