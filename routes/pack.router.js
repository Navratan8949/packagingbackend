const express = require("express");
const router = express.Router();
const packController = require("../controller/pack.controller");

// Create PO
router.post("/packs", packController.createPO);

// Add Box to PO
router.post("/packs/:poId/boxes", packController.addBox);

// Add Item to Box
router.post("/packs/:poId/boxes/:boxId/items", packController.addItemToBox);

// Close Box
router.put("/packs/:poId/boxes/:boxId/close", packController.closeBox);

// Get all PO
router.get("/packs/allPO", packController.getAllPO);

// Get PO with boxes & items
router.get("/packs/:poId", packController.getPO);

module.exports = router;
