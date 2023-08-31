import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const tasks = database.select("tasks");

      return res.writeHead(200).end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;

      if (!title || !description) {
        res.writeHead(400, {
          "Content-Type": "application/json",
        });
        res.end(
          JSON.stringify({ error: "Title and description are required" })
        );
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed: false,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      if (task.completed) {
        task.completed_at = new Date();
      }

      database.insert("tasks", task);

      return res.writeHead(201).end(JSON.stringify(task));
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description, completed } = req.body;

      const updatedFields = {
        completed: completed ?? false,
        updated_at: new Date(),
      };

      if (title !== undefined) {
        updatedFields.title = title;
      }

      if (description !== undefined) {
        updatedFields.description = description;
      }

      if (updatedFields.completed) {
        updatedFields.completed_at = new Date();
      }

      const task = database.update("tasks", id, updatedFields);

      return res.writeHead(200).end(JSON.stringify(task));
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      database.delete("tasks", id);

      return res.writeHead(204).end("Task deleted");
    },
  },
];
