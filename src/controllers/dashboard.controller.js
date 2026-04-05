import {prisma} from '../lib/prismaAdaptor.js'
import {TYPE} from '../lib/constants.js'
import z from 'zod';
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
                type : TYPE.income
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
                type : TYPE.expense
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
            if(d.type ===TYPE.income ){
                income = d._sum.amount;
            }else if(d.type === TYPE.expense){
                expance = d._sum.amount;
            }
        })
        const netbalance = income-expance;
        return res.status(200).json({
            success: true,
            income,
            expance,
            netbalance
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
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
        const start = new Date(`${year}-01-01`);
        const end = new Date(`${year}-12-31`);
        const trends = await prisma.$queryRaw`
            SELECT strftime('%Y-%m',date) AS month ,
            CAST(SUM(CASE WHEN type = ${TYPE.income} THEN amount ELSE 0 END) AS INTEGER) AS total_income,
            CAST(SUM(CASE WHEN type = ${TYPE.expense} THEN amount ELSE 0 END) AS INTEGER) AS total_expense
            from financeData
            WHERE date BETWEEN ${start} AND ${end}
            GROUP BY month
            ORDER BY month;
        `;
        const formattedTrends = trends.map(item => ({
          month: item.month,
          total_income: Number(item.total_income),
          total_expense: Number(item.total_expense),
        }));
        // console.log();
        return res.status(200).json({
            success: true,
            data:formattedTrends
        })
    } catch (error) {
        if (error.errors) {
          return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: error.message,
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
        const start = new Date(`${year}-01-01`);
        const end = new Date(`${year}-12-31`);
        const result = await prisma.$queryRaw`
        SELECT strftime('%m',date) AS month, category, SUM(amount) AS total_expense
        FROM financeData
        WHERE date BETWEEN ${start} AND ${end}
        GROUP BY month,category
        `
        const formattedTrends = result.map(item => ({
            month: item.month,
            category: item.category,
            total_expense: Number(item.total_expense),
        }));
        return res.status(200).json({
            success: true,
            data:formattedTrends
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