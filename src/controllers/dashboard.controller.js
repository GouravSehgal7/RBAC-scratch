import {prisma} from '../lib/prismaAdaptor.js'

export const getcompletedata = async (req, res) => {
  try {
    const data = await prisma.financeData.findMany();
    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching data",
      error: error.message
    });
  }
};

export const createdata = async (req,res)=>{
    try {
         const { amount, category, type, date, notes } = req.body;
        if (!amount || !category || !type || !date) {
            return res.status(400).json({
              success: false,
              message: "Required fields: amount, category, type, date"
            });
        }

        const data = await prisma.financeData.create({
            data:{
                amount:amount,
                category:category,
                date:date,
                type:type,
                notes:notes
            }
        })
        return res.status(201).json({
          success: true,
          data: data
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error creating finance data",
            error: error.message
        });
    }
}

export const getfiltereddata = async (req, res) => {
    try {
        const { type, category, startDate, endDate } = req.query;
        const where = {};
        if (type) where.type = type;
        if (category) where.category = category;
        if (startDate && endDate) {
            where.date = {
                gte: new Date(startDate),
                lte: new Date(endDate),
            };
        } else if (startDate) {
            where.date = { gte: new Date(startDate) };
        } else if (endDate) {
            where.date = { lte: new Date(endDate) };
        }

        const result = await prisma.financeData.findMany({
            where,
            orderBy: { date: 'asc' },
        });

        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching finance data",
            error: error.message
        });
    }
};

export const paginateddataget = async (req,res)=>{
// skip and limit
    try {
        const {skip,limit} = req.body;
        const data = await prisma.financeData.findMany({
            skip:skip,
            take:limit
        })
        return res.status(200).json({
            success: true,
            data : data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error creating finance data",
            error: error.message
        });
    }
}

export const totalincomecontroller = async (req,res)=>{
    try {
        // filter where category as income 
        const result = await prisma.financeData.aggregate({
            where: {
                type : "INCOME"
            },
            _sum : {amount: true}
        })
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error creating finance data",
            error: error.message
        });
    }
}

export const totalexpancecontroller = async (req,res)=>{
    try {
        // filter where category as income 
        const result = await prisma.financeData.aggregate({
            where: {
                type : "EXPENCE"
            },
            _sum : {amount: true}
        })
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error creating finance data",
            error: error.message
        });
    }
}

export const getnetbalance = async (req,res)=>{
    try {
        const result = await prisma.financeData.groupBy({
            by:['type'],
            _sum:{amount:true},
        })
        let income = 0;
        let expance = 0;
        result.forEach(d =>{
            if(d.type === "INCOME"){
                income = d._sum;
            }else if(d.type === "EXPANCE"){
                expance = d._sum;
            }
        })
        const netbalance = income-expance
        return res.status(200).json({
            success: true,
            income,
            expense,
            netbalance
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error creating finance data",
            error: error.message
        });
    }
}

export const categorywisetotalcontroller = async (req,res)=>{
    try {
        const result = await prisma.financeData.groupBy({
            by:["category"],
            _sum:{amount:true},
            _avg:{amount:true},
        })
        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching category-wise total",
            error: error.message
        });
    }
}

export const monthlytrendscontroller = async (req,res)=>{
    try {
        const bodySchema = z.object({
          year: z
            .number({ required_error: "Year is required", invalid_type_error: "Year must be a number" }).int("Year must be an integer").min(2000, "Year seems too early").max(new Date().getFullYear(), "Year cannot be in the future"),
        });

        const { year } = bodySchema.parse(req.body); // throws if invalid
        // const {year} = req.body;
        // based on year 
        // check sum(income) , sum(expence) for each month wise
        // only for salary
        const trends = await prisma.$queryRaw`
            SELECT strftime('%m',date) AS month ,
            SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END) AS total_income
            SUM(CASE WHEN type = 'EXPENCE' THEN amount ELSE 0 END) AS total_expence
            from financeData
            WHERE strftime('%y',date)=${year}
            GROUP BY month
            ORDER BY month;
        `;
        return res.status(200).json9({
            success: true,
            data:trends
        })
    } catch (error) {
        if (error.errors) {
          return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error.errors,
          });
        }
         return res.status(500).json({
            success: false,
            message: "Error creating finance data",
            error: error.message
        });
    }
}

export const monthlycategorycontroller = async (req,res)=>{
    try {
        // const {year} = req.body;
        const bodySchema = z.object({
          year: z
            .number({ required_error: "Year is required", invalid_type_error: "Year must be a number" })
            .int("Year must be an integer")
            .min(2000, "Year seems too early")
            .max(new Date().getFullYear(), "Year cannot be in the future"),
        });

        const { year } = bodySchema.parse(req.body); // throws if invalid
        const result = await prisma.$queryRaw`
        SELECT strftime('%m',date) AS month, category, SUM(amount)
        FROM financeData
        WHERE strftime('%y',date) = ${year}
        GROUP BY month,category
        ORDER BY month
        `
        return res.status(200).json({
            success: true,
            data:result
        })
    } catch (error) {
        if (error.errors) {
          return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error.errors,
          });
        }
        return res.status(500).json({
            success: false,
            message: "Error creating finance data",
            error: error.message
        });
    }
}
// show last 5 data input based
export const recentactivitycontroller = async (req,res)=>{
    try {
        const recentData = await prisma.financeData.findMany({
            orderBy: {
                date: 'desc',
            },
            take: 5,
        });

        return res.status(200).json({
            success: true,
            data: recentData,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error creating finance data",
            error: error.message
        });
    }
}