'use strict';

const fs = require('fs');
const path = require('path');
const { jsonFile, pagination } = require('./config');
const tasksContainer = require(jsonFile);

/**
 * GET /tasks
 *
 * Return the list of tasks with status code 200.
 */
const getTasks = (req, res) => {
  const page = parseInt(req.query.page, 10) || 1,
        total = tasksContainer.tasks.length,
        pageSize = parseInt(req.query.per_page, 10) || pagination.page_size,
        offset = (page - 1) * pageSize;

  tasksContainer.tasks.sort((a,b) => b.id - a.id);
  const tasks = tasksContainer.tasks.slice(offset, offset + pageSize);

  return res.status(200).json({
    tasks,
    pagination: {
      total,
      page,
      pageSize
    },
  });
};

/**
 * Get /task/:id
 *
 * id: Number
 *
 * Return the task for the given id.
 *
 * If found return status code 200 and the resource.
 * If not found return status code 404.
 * If id is not valid number return status code 400.
 */
const getTask = (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!Number.isNaN(id)) {
    const task = tasksContainer.tasks.find(item => item.id === id);
    if (!!task) {
      return res.status(200).json({
        task,
      });
    }
    return res.status(404).json({
      message: 'Not found.',
    });

  }
  return res.status(400).json({
    message: 'Bad request.',
  });

};

/**
 * PUT /task/update/:id/:title/:description
 *
 * id: Number
 * title: string
 * description: string
 *
 * Update the task with the given id.
 * If the task is found and update as well, return a status code 204.
 * If the task is not found, return a status code 404.
 * If the provided id is not a valid number return a status code 400.
 */
const updateTask = (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (!Number.isNaN(id)) {
    const task = tasksContainer.tasks.find(item => item.id === id);

    if (!!task) {
      task.title = decodeURI(req.params.title);
      task.description = decodeURI(req.params.description);

      const json = JSON.stringify(tasksContainer);
      return fs.writeFile(path.resolve(__dirname, jsonFile), json, 'utf8', (err) => {
        if (err === null) {
          return res.status(204).end();
        }
        return res.status(500).json({
          message: 'Cannot save file',
        });
      });
    }
    return res.status(404).json({
      message: 'Not found',
    });

  }
  return res.status(400).json({
    message: 'Bad request',
  });

};

/**
 * POST /task/create/:title/:description
 *
 * title: string
 * description: string
 *
 * Add a new task to the array tasksContainer.tasks with the given title and description.
 * Return status code 201.
 */
const addTask = (req, res) => {
  const task = {
    id: tasksContainer.tasks.length,
    title: decodeURI(req.params.title),
    description: decodeURI(req.params.description),
  };

  tasksContainer.tasks.push(task);

  const json = JSON.stringify(tasksContainer);
  fs.writeFile(path.resolve(__dirname, jsonFile), json, 'utf8', (err) => {
    if (err === null) {
      return res.status(201).json({
        message: 'Resource created',
        task
      });
    }
    return res.status(500).json({
      message: 'Cannot save file',
    });
  });
};

/**
 * DELETE /task/delete/:id
 *
 * id: Number
 *
 * Delete the task linked to the  given id.
 * If the task is found and deleted as well, return a status code 204.
 * If the task is not found, return a status code 404.
 * If the provided id is not a valid number return a status code 400.
 */
const deleteTask = (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!Number.isNaN(id)) {
    const task = tasksContainer.tasks.find(item => item.id === id);

    if (!!task) {
      const taskIndex = tasksContainer.tasks.indexOf(task);
      tasksContainer.tasks.splice(taskIndex, 1);

      const json = JSON.stringify(tasksContainer);
      return fs.writeFile(path.resolve(__dirname, jsonFile), json, 'utf8', (err) => {
        if (err === null) {
          return res.status(200).json({
            message: 'Updated successfully',
          });
        }
        return res.status(500).json({
          message: 'Cannot save file',
        });
      });
    }
    return res.status(404).json({
      message: 'Not found',
    });
  }
  return res.status(400).json({
    message: 'Bad request',
  });
};

module.exports = {
  getTasks,
  getTask,
  updateTask,
  addTask,
  deleteTask
};
