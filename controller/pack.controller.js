const PackModel = require("../model/pack.model");

// 1️⃣ Create PO
exports.createPO = async (req, res) => {
  try {
    const { poNumber, buyerName, otherRefNumber } = req.body;

    // Check if PO with same poNumber already exists
    const existingPO = await PackModel.findOne({ poNumber });
    if (existingPO) {
      return res.status(409).json({
        message: "PO with this poNumber already exists",
      });
    }

    // Create new PO
    const newPack = new PackModel({
      poNumber,
      buyerName,
      otherRefNumber,
      boxes: [],
    });

    const savedPO = await newPack.save();
    res.status(201).json({
      message: "PO created successfully",
      data: savedPO,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating PO", error: error.message });
  }
};

// 2️⃣ Add Box to PO
exports.addBox = async (req, res) => {
  try {
    const { poId } = req.params;
    const { boxName } = req.body;

    const nowDate = new Date().toISOString().split("T")[0];
    const nowTime = new Date().toTimeString().split(" ")[0];

    const updatedPO = await PackModel.findByIdAndUpdate(
      poId,
      {
        $push: { boxes: { boxName, items: [], status: "open" } },
        updatedDate: nowDate,
        updatedTime: nowTime,
      },
      { new: true }
    );

    if (!updatedPO) {
      return res.status(404).json({ message: "PO not found" });
    }

    res.status(200).json({
      message: "Box added successfully",
      data: updatedPO,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding box", error: error.message });
  }
};

// 3️⃣ Add Item to Box
exports.addItemToBox = async (req, res) => {
  try {
    const { poId, boxId } = req.params;
    let { sku, quantity } = req.body;

    if (!sku) {
      return res.status(400).json({ message: "SKU is required" });
    }

    // Default quantity = 1
    if (!quantity || quantity <= 0) {
      quantity = 1;
    }

    const pack = await PackModel.findById(poId);
    if (!pack) {
      return res.status(404).json({ message: "PO not found" });
    }

    const box = pack.boxes.id(boxId);
    if (!box) {
      return res.status(404).json({ message: "Box not found" });
    }

    if (box.status === "closed") {
      return res
        .status(400)
        .json({ message: "Cannot add items to closed box" });
    }

    // 🔹 Check if item with same SKU already exists
    const existingItem = box.items.find((item) => item.sku === sku);

    if (existingItem) {
      // Increase quantity if SKU exists
      existingItem.quantity += quantity;
    } else {
      // Add new item if SKU doesn't exist
      box.items.push({ sku, quantity });
    }

    // Update "Updated At"
    pack.updatedDate = new Date().toISOString().split("T")[0];
    pack.updatedTime = new Date().toTimeString().split(" ")[0];

    await pack.save();

    res.status(200).json({
      message: existingItem
        ? "Item quantity updated successfully"
        : "Item added successfully",
      data: pack,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding/updating item", error: error.message });
  }
};

// 4️⃣ Get PO with all boxes & items
exports.getPO = async (req, res) => {
  try {
    const { poId } = req.params;
    const po = await PackModel.findById(poId);
    if (!po) {
      return res.status(404).json({ message: "PO not found" });
    }
    res.status(200).json({ message: "PO fetched successfully", data: po });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching PO", error: error.message });
  }
};

exports.getAllPO = async (req, res) => {
  try {
    const allPO = await PackModel.find({}); // sabhi PO fetch karne ke liye

    return res.status(200).json({
      message: "Fetch all PO successfully",
      data: allPO,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching PO",
      error: error.message,
    });
  }
};

// Close Box
exports.closeBox = async (req, res) => {
  try {
    const { poId, boxId } = req.params;

    const pack = await PackModel.findById(poId);
    if (!pack) {
      return res.status(404).json({ message: "PO not found" });
    }

    const box = pack.boxes.id(boxId);
    if (!box) {
      return res.status(404).json({ message: "Box not found" });
    }

    if (box.status === "closed") {
      return res.status(400).json({ message: "Box is already closed" });
    }

    box.status = "closed";

    pack.updatedDate = new Date().toISOString().split("T")[0];
    pack.updatedTime = new Date().toTimeString().split(" ")[0];

    await pack.save();

    res.status(200).json({
      message: "Box closed successfully",
      data: pack,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error closing box", error: error.message });
  }
};

// // 2️⃣ Add Box to PO
// exports.addBox = async (req, res) => {
//   try {
//     const { poId } = req.params;
//     const { boxName } = req.body;

//     const updatedPO = await PackModel.findByIdAndUpdate(
//       poId,
//       { $push: { boxes: { boxName, items: [] } } },
//       { new: true }
//     );

//     if (!updatedPO) {
//       return res.status(404).json({ message: "PO not found" });
//     }

//     res.status(200).json({
//       message: "Box added successfully",
//       data: updatedPO,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error adding box", error: error.message });
//   }
// };

// // 3️⃣ Add Item to Box
// exports.addItemToBox = async (req, res) => {
//   try {
//     const { poId, boxId } = req.params;
//     let { sku, quantity } = req.body;

//     if (!sku) {
//       return res.status(400).json({ message: "SKU is required" });
//     }

//     // Default quantity = 1 if not provided or invalid
//     if (!quantity || quantity <= 0) {
//       quantity = 1;
//     }

//     const pack = await PackModel.findById(poId);
//     if (!pack) {
//       return res.status(404).json({ message: "PO not found" });
//     }

//     const box = pack.boxes.id(boxId);
//     if (!box) {
//       return res.status(404).json({ message: "Box not found" });
//     }

//     box.items.push({ sku, quantity });
//     await pack.save();

//     res.status(200).json({
//       message: "Item added successfully",
//       data: pack,
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error adding item", error: error.message });
//   }
// };
