const Category = require("../models/productCategory");
const SubCategory = require("../models/productSubCategory");
const Product = require("../models/productModel");

const { uploadToCloudinary } = require("../utils/imageUploader");


// ! createCategory
exports.createCategory = async (req, res) => {
  try {
    // fetch the data
    const {title} = req.body;

        
    const thumbnail = req.files.thumbnail;

    
    // validation
    if (!title || !thumbnail) {
      return res.status(400).json({
        success: false,
        message: "all fields are required",
      });
    }

    const image = await uploadToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME,
        1000,
        1000
      );


    // create entry in db
    const categoryDetails = await Category.create({ title ,thumbnail: image.secure_url});



    // return
    return res.status(200).json({
      success: true,
      message: "category created successfully",
      categoryDetails
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//! get all category
exports.showAllCategory = async (req, res) => {
  try {

    const allCategory = await Category.find({}, { title: true, thumbnail: true, subCategory: true })
    .populate({
        path: "subCategory",
        populate: {
            path: "products", 
            model: "Product", 
        },
    });
    res.status(200).json({
      success: true,
      message: "all category return succesfully",
     data:allCategory,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ! delete category 
exports.deleteCategory = async(req , res)=>{
  try{

    const {categoryId} = req.params;


     const categoryDetail = await Category.findOne({_id:categoryId}).populate("subCategory");

 console.log(categoryDetail)
     if(!categoryDetail){
      return res.status(404).json({
        success:false ,
        message:"category do not found with this ID"
      })
     }

   
    if(categoryDetail.subCategory.length > 0 ){
      return res.status(403).json({
        success:false ,
        message:"Please Delete All the Sub Category"
      })
    }

     await Category.findByIdAndDelete({_id:categoryId} , {new:true});

     return res.status(200).json({
      success:true  ,
      message:"Category deleted successfuly"
     })

  } catch(error){
     console.log(error);
     return res.status(500).json({
      success:false , 
      message:"internal server error , delete category"
     })
  }
}

// ! update category 
exports.updateCategory = async(req , res)=>{
  try{

    const {categoryId} = req.params;

    const {title } = req.body;


    if(!categoryId){
      return res.status(403).json({
        success:false , 
        message:"please send the cattegory Id"
      })
    }

    if(!title){
      return res.status(403).json({
        success:false , 
        message:"no new update is done "
      })
    }

    const categoryDetails = await Category.findById({_id:categoryId});

    if(!categoryDetails){
      return res.status(404).json({
        success:false , 
        message:"no category found with this Id"
      })
    }


       categoryDetails.title = title;

    // ✅ Save the updated category
    await categoryDetails.save();

     return res.status(200).json({
      success:true , 
      message:"successfuly updated the category"
     })


  } catch(error){
    console.log(error);
    return res.status(500).json({
      success:false , 
      message:"update category intenal server error"
    })
  }
}


exports.fetchCategoryPageDetail = async(req , res)=>{
  try{

       const {categoryId} = req.params;

           if(!categoryId){
              return res.status(403).json({
                  success:false ,
                  message:"Please send the category Id"
              })
           }

           const categoryDetails = await Category.findById({_id:categoryId});

           if(!categoryDetails){
              return res.status(404).json({
                  success:false , 
                  message:"Cannot find the category with this id "
              })
           }

            return res.status(200).json({
              success:true ,
              message:"Successfuly fetch the subCategory",
               categoryDetails
            })



  } catch(error){
      console.log(error);
      return res.status(500).json({
          success:false , 
          message:"Internal server error "
      })
  }
}




// exports.getProductsByCategoryId = async (req, res) => {
//   try {
//     const { categoryId } = req.params;

//     // Check if category exists
//     const categoryDetail = await Category.findById(categoryId);
//     if (!categoryDetail) {
//       return res.status(404).json({
//         success: false,
//         message: "Category not found with this ID",
//       });
//     }

//     // Get subcategories associated with the category
//     const subcategories = await SubCategory.find({
//       _id: { $in: categoryDetail.subCategory }, 
//     });

//     // Get all product IDs from the subcategories
//     const productIds = subcategories.flatMap(
//       (subcategory) => subcategory.products
//     );

//     // Fetch all products using those IDs
//     const products = await Product.find({
//       _id: { $in: productIds },
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Products fetched successfully",
//       products
//     });
//   } catch (error) {
//     console.error("Error retrieving products by category ID:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };


exports.getProductsByCategoryId = async(req ,res)=> {
  try {
    // Find the category with the provided ID
    const {categoryId} = req.params;

    const categoryDetail = await Category.findById({_id:categoryId});


    if (!categoryDetail) {
      console.log("Category not found");
      return res.status(403).json({
        success:false ,
        messagge:"Catgoey do not found with this id"
      })
    }

    // Find the subcategories associated with the category
    const subcategories = await SubCategory.find({
      _id: { $in: categoryDetail.subCategory }
    }).exec();
 
    console.log("subcate",subcategories);

    // Extract product IDs from the subcategories
    const productIds = subcategories.flatMap(subcategory => subcategory.products);

    console.log("products",productIds);
    
    // Find all products based on the extracted IDs
    const products = await Product.find({
      _id: { $in: productIds }
    }).exec();
    
    console.log("products2",products);
    

    return res.status(200).json({
      success:true ,
      message:" Successfuly  fetch",
      products:products,
      category: categoryDetail,
    })

  } catch (error) {
    console.error("Error retrieving products by category ID:", error);
    res.status(500).json({
      success:false ,
      message:"internal server error"
    })
  }
}  