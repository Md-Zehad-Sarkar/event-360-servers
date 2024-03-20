import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./app/config";
import { ObjectId } from "mongodb";

export const app: Application = express();
const uri = config.db_url;
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    const servicesCollection = client.db("Event360").collection("Services");
    const eventCollection = client.db("Event360").collection("Events");
    const eventListCollection = client.db("Event360").collection("EventLists");
    const addEventCollection = client.db("Event360").collection("AddEvent");
    const addServicesCollection = client
      .db("Event360")
      .collection("AddServices");

    //data get for our services
    try {
      app.get("/services", async (req, res) => {
        const result = await servicesCollection.find().toArray();
        res.send(result);
      });
    } catch (error) {
      console.log(error);
    }

    //data get for event items
    try {
      app.get("/events", async (req, res) => {
        const result = await eventCollection.find().toArray();

        res.send(result);
      });
    } catch (error) {
      console.log("get services", error);
    }

    //data get for recent event
    try {
      app.get("/events-list", async (req, res) => {
        const result = await eventListCollection.find().toArray();
        res.send(result);
      });
    } catch (error) {
      console.log("get services", error);
    }

    //create event item
    app.post("/add-event", async (req, res) => {
      const data = req.body;
      const result = await addEventCollection.insertOne(data);
      res.send(result);
    });

    //get event item for dashboard
    app.get("/admin-event-management", async (req, res) => {
      const result = await addEventCollection.find().toArray();
      res.send(result);
    });

    //update event item for event management
    app.put("/admin/update-event/:id", async (req, res) => {
      const id = req.params.id;

      if (!id) {
        return res.send({ message: "id not found" });
      }
      const filter = { _id: new ObjectId(id) };
      const body = req.body;

      const updateDoc = {
        $set: {
          name: body.name,
          imageUrl: body.imageUrl,
          date: body?.date,
          status: body?.status,
        },
      };
      const result = await addEventCollection.updateOne(filter, updateDoc, {
        upsert: true,
      });
      res.send(result);
    });

    //approved event item for event management
    app.put("/admin/approve-event/:id", async (req, res) => {
      const id = req.params.id;

      if (!id) {
        return res.send({ message: "id not found" });
      }

      const filter = { _id: new ObjectId(id) };
      const body = req.body;

      const updateDoc = {
        $set: {
          status: body?.status,
        },
      };
      const result = await addEventCollection.updateOne(filter, updateDoc, {
        upsert: true,
      });
      res.send(result);
    });

    //delete event item for event management
    app.delete("/delete-event/:id", async (req, res) => {
      try {
        const id = req.params.id;
        if (!id) {
          return res.send({ message: "id not found" });
        }
        const result = await addEventCollection.deleteOne({
          _id: new ObjectId(id),
        });
        res.send(result);
      } catch (error) {
        //
      }
    });

    // ...........update service item for service management..............
    app.patch("/admin/update-service/:id", async (req, res) => {
      const id = req.params.id;

      if (!id) {
        return res.send({ message: "id not found" });
      }
      const filter = { _id: new ObjectId(id) };
      const body = req.body;

      const updateDoc = {
        $set: {
          name: body.name,
          imageUrl: body.imageUrl,
          date: body?.date,
          status: body?.status,
          items: body?.items,
        },
      };

      const result = await addServicesCollection.updateOne(filter, updateDoc, {
        upsert: true,
      });
      res.send(result);
    });

    //.............delete service item for service management............
    app.delete("/delete-service/:id", async (req, res) => {
      try {
        const id = req.params.id;
        if (!id) {
          return res.send({ message: "id not found" });
        }
        const result = await addServicesCollection.deleteOne({
          _id: new ObjectId(id),
        });
        res.send(result);
      } catch (error) {
        //
      }
    });

    //approved event item for event management
    app.put("/admin/approve-service/:id", async (req, res) => {
      const id = req.params.id;

      if (!id) {
        return res.send({ message: "id not found" });
      }

      const filter = { _id: new ObjectId(id) };
      const body = req.body;

      const updateDoc = {
        $set: {
          status: body?.status,
        },
      };
      const result = await addServicesCollection.updateOne(filter, updateDoc, {
        upsert: true,
      });
      res.send(result);
    });

    //get service management for dashboard
    app.get("/admin-service-management", async (req, res) => {
      const result = await addServicesCollection.find().toArray();
      res.send(result);
    });

    //create service for dashboard
    app.post("/add-service", async (req, res) => {
      const data = req.body;
      const result = await addServicesCollection.insertOne(data);
      res.send(result);
    });
    //
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.get("/", (req: Request, res: Response) => {
  res.send("Event 360 Server Are Running.");
});
