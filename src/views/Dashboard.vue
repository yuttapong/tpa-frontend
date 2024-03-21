<template>
    <div class="pagetitle">
        <h1>Dashboard</h1>
        <nav>
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><router-link tag="a" to="/">Home</router-link></li>
                <li class="breadcrumb-item active">Dashboard</li>
            </ol>
        </nav>
    </div><!-- End Page Title -->

    <section class="section dashboard">
        <div class="row">

            <!-- Left side columns -->
            <div class="col-lg-12">
                <div class="row">

                    <!-- quotation Card -->
                    <div class="col-xxl-4 col-md-6">
                        <div class="card info-card quotation-card">

                            <div class="filter">
                                <a class="icon" href="#" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></a>
                                <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                    <li class="dropdown-header text-start">
                                        <h6>Filter</h6>
                                    </li>

                                    <li><a class="dropdown-item" href="#">Today</a></li>
                                    <li><a class="dropdown-item" href="#">This Month</a></li>
                                    <li><a class="dropdown-item" href="#">This Year</a></li>
                                </ul>
                            </div>

                            <div class="card-body">
                                <router-link to="/quotations">
                                    <h5 class="card-title">Quotations / ใบเสนอราคา <span>| Today</span></h5>
                                </router-link>

                                <div class="d-flex align-items-center">
                                    <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                        <i class="bi bi-files"></i>
                                    </div>
                                    <div class="ps-3">
                                        <h6>145</h6>
                                        <span class="text-success small pt-1 fw-bold">12%</span> <span
                                            class="text-muted small pt-2 ps-1">increase</span>

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div><!-- End quotation Card -->

                    <!-- bill Card -->
                    <div class="col-xxl-4 col-md-6">
                        <div class="card info-card bill-card">

                            <div class="filter">
                                <a class="icon" href="#" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></a>
                                <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                    <li class="dropdown-header text-start">
                                        <h6>Filter</h6>
                                    </li>

                                    <li><a class="dropdown-item" href="#">Today</a></li>
                                    <li><a class="dropdown-item" href="#">This Month</a></li>
                                    <li><a class="dropdown-item" href="#">This Year</a></li>
                                </ul>
                            </div>

                            <div class="card-body">
                                <router-link to="/bills">
                                    <h5 class="card-title">Bills / ใบขอรับริการ <span>| This Month</span></h5>
                                </router-link>


                                <div class="d-flex align-items-center">
                                    <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                        <i class="bi bi-card-list"></i>
                                    </div>
                                    <div class="ps-3">
                                        <h6>120</h6>
                                        <!-- <span class="text-success small pt-1 fw-bold">8%</span>
                                        <span class="text-muted small pt-2 ps-1">increase</span> -->

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div><!-- End bill Card -->
                    <!-- invoices Card -->
                    <div class="col-xxl-4 col-md-6">
                        <div class="card info-card invoice-card">

                            <div class="filter">
                                <a class="icon" href="#" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></a>
                                <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                    <li class="dropdown-header text-start">
                                        <h6>Filter</h6>
                                    </li>

                                    <li><a class="dropdown-item" href="#">Today</a></li>
                                    <li><a class="dropdown-item" href="#">This Month</a></li>
                                    <li><a class="dropdown-item" href="#">This Year</a></li>
                                </ul>
                            </div>

                            <div class="card-body">
                                <router-link to="/invoices">
                                    <h5 class="card-title">Invoices / ใบแจ้งหนี้ <span>| Today</span></h5>
                                </router-link>


                                <div class="d-flex align-items-center">
                                    <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                        <i class="bi bi-receipt"></i>
                                    </div>
                                    <div class="ps-3">
                                        <h6>200</h6>
                                        <!-- <span class="text-success small pt-1 fw-bold">12%</span> 
                                        <span class="text-muted small pt-2 ps-1">increase</span> -->

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div><!-- End invoices Card -->
                    <!-- certificate Card -->
                    <div class="col-xxl-4 col-md-6">

                        <div class="card info-card certificate-card">

                            <div class="filter">
                                <a class="icon" href="#" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></a>
                                <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                    <li class="dropdown-header text-start">
                                        <h6>Filter</h6>
                                    </li>

                                    <li><a class="dropdown-item" href="#">Today</a></li>
                                    <li><a class="dropdown-item" href="#">This Month</a></li>
                                    <li><a class="dropdown-item" href="#">This Year</a></li>
                                </ul>
                            </div>

                            <div class="card-body">
                                <router-link to="/certificates">
                                    <h5 class="card-title">Certificates / ใบรับรอง <span>| This Year</span></h5>
                                </router-link>


                                <div class="d-flex align-items-center">
                                    <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                        <i class="bi bi-patch-check"></i>
                                    </div>
                                    <div class="ps-3">
                                        <h6>2150</h6>
                                        <!-- <span class="text-danger small pt-1 fw-bold">12%</span>
                <span class="text-muted small pt-2 ps-1">decrease</span> -->
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div><!-- End certificate Card -->
                    <!-- Standard Instrument Card -->
                    <div class="col-xxl-4 col-md-6">
                        <div class="card info-card stdinstrument-card">

                            <div class="filter">
                                <a class="icon" href="#" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></a>
                                <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                    <li class="dropdown-header text-start">
                                        <h6>Filter</h6>
                                    </li>

                                    <li><a class="dropdown-item" href="#">Today</a></li>
                                    <li><a class="dropdown-item" href="#">This Month</a></li>
                                    <li><a class="dropdown-item" href="#">This Year</a></li>
                                </ul>
                            </div>

                            <div class="card-body">
                                <router-link to="/stdinstruments">
                                    <h5 class="card-title">Standard Intruments <span>| Today</span></h5>
                                </router-link>


                                <div class="d-flex align-items-center">
                                    <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                        <i class="bi bi-tools"></i>
                                    </div>
                                    <div class="ps-3">
                                        <h6>200</h6>
                                        <!-- <span class="text-success small pt-1 fw-bold">12%</span> 
                                        <span
                                            class="text-muted small pt-2 ps-1">increase</span> -->

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div><!-- End Sales Card -->
                    <!-- Standard products Card -->
                    <div class="col-xxl-4 col-md-6">
                        <div class="card info-card product-card">

                            <div class="filter">
                                <a class="icon" href="#" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></a>
                                <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                    <li class="dropdown-header text-start">
                                        <h6>Filter</h6>
                                    </li>

                                    <li><a class="dropdown-item" href="#">Today</a></li>
                                    <li><a class="dropdown-item" href="#">This Month</a></li>
                                    <li><a class="dropdown-item" href="#">This Year</a></li>
                                </ul>
                            </div>

                            <div class="card-body">
                                <router-link to="/products">
                                    <h5 class="card-title">Products / สินค้า <span>| Today</span></h5>
                                </router-link>


                                <div class="d-flex align-items-center">
                                    <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                        <i class="bi bi-tools"></i>
                                    </div>
                                    <div class="ps-3">
                                        <h6>200</h6>
                                        <!-- <span class="text-success small pt-1 fw-bold">12%</span> 
                                        <span
                                            class="text-muted small pt-2 ps-1">increase</span> -->

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div><!-- End products Card -->





                    <!-- Customers Card -->
                    <div class="col-xxl-4 col-xl-12">

                        <div class="card info-card customers-card">

                            <div class="filter">
                                <a class="icon" href="#" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></a>
                                <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                    <li class="dropdown-header text-start">
                                        <h6>Filter</h6>
                                    </li>

                                    <li><a class="dropdown-item" href="#">Today</a></li>
                                    <li><a class="dropdown-item" href="#">This Month</a></li>
                                    <li><a class="dropdown-item" href="#">This Year</a></li>
                                </ul>
                            </div>

                            <div class="card-body">
                                <router-link to="/customers">
                                    <h5 class="card-title">Customers <span>| This Year</span></h5>
                                </router-link>


                                <div class="d-flex align-items-center">
                                    <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                        <i class="bi bi-people"></i>
                                    </div>
                                    <div class="ps-3">
                                        <h6>1244</h6>
                                        <span class="text-danger small pt-1 fw-bold">12%</span> <span
                                            class="text-muted small pt-2 ps-1">decrease</span>

                                    </div>
                                </div>

                            </div>
                        </div>

                    </div><!-- End Customers Card -->
                    <!-- staffs Card -->
                    <div class="col-xxl-4 col-xl-12">

                        <div class="card info-card staff-card">

                            <div class="filter">
                                <a class="icon" href="#" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></a>
                                <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                    <li class="dropdown-header text-start">
                                        <h6>Filter</h6>
                                    </li>

                                    <li><a class="dropdown-item" href="#">Today</a></li>
                                    <li><a class="dropdown-item" href="#">This Month</a></li>
                                    <li><a class="dropdown-item" href="#">This Year</a></li>
                                </ul>
                            </div>

                            <div class="card-body">
                                <router-link to="/staffs">
                                    <h5 class="card-title">Staffs / พนักงาน <span>| This Year</span></h5>
                                </router-link>


                                <div class="d-flex align-items-center">
                                    <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                        <i class="bi bi-person-circle"></i>
                                    </div>
                                    <div class="ps-3">
                                        <h6>213</h6>
                                        <span class="text-danger small pt-1 fw-bold">12%</span> <span
                                            class="text-muted small pt-2 ps-1">decrease</span>

                                    </div>
                                </div>

                            </div>
                        </div>

                    </div><!-- End staffs Card -->


                    <!-- Reports -->
                    <!-- <div class="col-12">
                        <div class="card">

                            <div class="filter">
                                <a class="icon" href="#" data-bs-toggle="dropdown"><i class="bi bi-three-dots"></i></a>
                                <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
                                    <li class="dropdown-header text-start">
                                        <h6>Filter</h6>
                                    </li>

                                    <li><a class="dropdown-item" href="#">Today</a></li>
                                    <li><a class="dropdown-item" href="#">This Month</a></li>
                                    <li><a class="dropdown-item" href="#">This Year</a></li>
                                </ul>
                            </div>

                            <div class="card-body">
                                <h5 class="card-title">Reports <span>/Today</span></h5>


                                <div id="reportsChart"></div>




                            </div>

                        </div>
                    </div> -->
                    <!-- End Reports -->





                </div>
            </div><!-- End Left side columns -->

            <!-- Right side columns -->
            <!-- <div class="col-lg-4">




            </div> -->
            <!-- End Right side columns -->

        </div>
    </section>
</template>
<script setup>
import * as echarts from "echarts"
import p1 from "../assets/img/product-1.jpg";
import p2 from "../assets/img/product-2.jpg";
import p3 from "../assets/img/product-3.jpg";
import p4 from "../assets/img/product-4.jpg";
import p5 from "../assets/img/product-5.jpg";

import news1 from "../assets/img/news-1.jpg";
import news2 from "../assets/img/news-2.jpg";
import news3 from "../assets/img/news-3.jpg";
import news4 from "../assets/img/news-4.jpg";
import news5 from "../assets/img/news-5.jpg";


document.addEventListener("DOMContentLoaded", () => {

    var budgetChart = echarts.init(document.querySelector("#budgetChart")).setOption({
        legend: {
            data: ['Allocated Budget', 'Actual Spending']
        },
        radar: {
            // shape: 'circle',
            indicator: [{
                name: 'Sales',
                max: 6500
            },
            {
                name: 'Administration',
                max: 16000
            },
            {
                name: 'Information Technology',
                max: 30000
            },
            {
                name: 'Customer Support',
                max: 38000
            },
            {
                name: 'Development',
                max: 52000
            },
            {
                name: 'Marketing',
                max: 25000
            }
            ]
        },
        series: [{
            name: 'Budget vs spending',
            type: 'radar',
            data: [{
                value: [4200, 3000, 20000, 35000, 50000, 18000],
                name: 'Allocated Budget'
            },
            {
                value: [5000, 14000, 28000, 26000, 42000, 21000],
                name: 'Actual Spending'
            }
            ]
        }]
    });
});

document.addEventListener("DOMContentLoaded", () => {
    echarts.init(document.querySelector("#trafficChart")).setOption({
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center'
        },
        series: [{
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: '18',
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: [{
                value: 1048,
                name: 'Search Engine'
            },
            {
                value: 735,
                name: 'Direct'
            },
            {
                value: 580,
                name: 'Email'
            },
            {
                value: 484,
                name: 'Union Ads'
            },
            {
                value: 300,
                name: 'Video Ads'
            }
            ]
        }]
    });
});


document.addEventListener("DOMContentLoaded", () => {
    new ApexCharts(document.querySelector("#reportsChart"), {
        series: [{
            name: 'Sales',
            data: [31, 40, 28, 51, 42, 82, 56],
        }, {
            name: 'Revenue',
            data: [11, 32, 45, 32, 34, 52, 41]
        }, {
            name: 'Customers',
            data: [15, 11, 32, 18, 9, 24, 11]
        }],
        chart: {
            height: 350,
            type: 'area',
            toolbar: {
                show: false
            },
        },
        markers: {
            size: 4
        },
        colors: ['#4154f1', '#2eca6a', '#ff771d'],
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.3,
                opacityTo: 0.4,
                stops: [0, 90, 100]
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 2
        },
        xaxis: {
            type: 'datetime',
            categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
        },
        tooltip: {
            x: {
                format: 'dd/MM/yy HH:mm'
            },
        }
    }).render();
});
</script>
<style scoped lang="scss">
/*--------------------------------------------------------------
  # Dashboard
  --------------------------------------------------------------*/
/* Filter dropdown */
.dashboard .filter {
    position: absolute;
    right: 0px;
    top: 15px;
}

.dashboard .filter .icon {
    color: #aab7cf;
    padding-right: 20px;
    padding-bottom: 5px;
    transition: 0.3s;
    font-size: 16px;
}

.dashboard .filter .icon:hover,
.dashboard .filter .icon:focus {
    color: #4154f1;
}

.dashboard .filter .dropdown-header {
    padding: 8px 15px;
}

.dashboard .filter .dropdown-header h6 {
    text-transform: uppercase;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 1px;
    color: #aab7cf;
    margin-bottom: 0;
    padding: 0;
}

.dashboard .filter .dropdown-item {
    padding: 8px 15px;
}

/* Info Cards */
.dashboard .info-card {
    padding-bottom: 10px;
}

.dashboard .info-card h6 {
    font-size: 28px;
    color: #012970;
    font-weight: 700;
    margin: 0;
    padding: 0;
}

.dashboard .card-icon {
    font-size: 32px;
    line-height: 0;
    width: 64px;
    height: 64px;
    flex-shrink: 0;
    flex-grow: 0;
}


// ################ CARD ######################
.dashboard .quotation-card .card-icon {
    color: #4154f1;
    background: #f6f6fe;
}

.dashboard .bill-card .card-icon {
    color: #2eca6a;
    background: #e0f8e9;
}

.dashboard .invoice-card .card-icon {
    color: #b3b4af;
    background: #ffecdf;
}

.dashboard .stdinstrument-card .card-icon {
    color: #5d8eac;
    background: #9ed0ef;
}

.dashboard .product-card .card-icon {
    color: #b1c33b;
    background: #e1eca5;
}

.dashboard .certificate-card .card-icon {
    color: #ff771d;
    background: #ffecdf;
}


.dashboard .customers-card .card-icon {
    color: #ff771d;
    background: #ffecdf;
}



.dashboard .staff-card .card-icon {
    color: #c082c1;
    background: #d7b5ca;
}


/* Activity */
.dashboard .activity {
    font-size: 14px;
}

.dashboard .activity .activity-item .activite-label {
    color: #888;
    position: relative;
    flex-shrink: 0;
    flex-grow: 0;
    min-width: 64px;
}

.dashboard .activity .activity-item .activite-label::before {
    content: '';
    position: absolute;
    right: -11px;
    width: 4px;
    top: 0;
    bottom: 0;
    background-color: #eceefe;
}

.dashboard .activity .activity-item .activity-badge {
    margin-top: 3px;
    z-index: 1;
    font-size: 11px;
    line-height: 0;
    border-radius: 50%;
    flex-shrink: 0;
    border: 3px solid #fff;
    flex-grow: 0;
}

.dashboard .activity .activity-item .activity-content {
    padding-left: 10px;
    padding-bottom: 20px;
}

.dashboard .activity .activity-item:first-child .activite-label::before {
    top: 5px;
}

.dashboard .activity .activity-item:last-child .activity-content {
    padding-bottom: 0;
}

/* News & Updates */
.dashboard .news .post-item+.post-item {
    margin-top: 15px;
}

.dashboard .news img {
    width: 80px;
    float: left;
    border-radius: 5px;
}

.dashboard .news h4 {
    font-size: 15px;
    margin-left: 95px;
    font-weight: bold;
    margin-bottom: 5px;
}

.dashboard .news h4 a {
    color: #012970;
    transition: 0.3s;
}

.dashboard .news h4 a:hover {
    color: #4154f1;
}

.dashboard .news p {
    font-size: 14px;
    color: #777777;
    margin-left: 95px;
}

/* Recent Sales */
.dashboard .recent-sales {
    font-size: 14px;
}

.dashboard .recent-sales .table thead {
    background: #f6f6fe;
}

.dashboard .recent-sales .table thead th {
    border: 0;
}

.dashboard .recent-sales .dataTable-top {
    padding: 0 0 10px 0;
}

.dashboard .recent-sales .dataTable-bottom {
    padding: 10px 0 0 0;
}

/* Top Selling */
.dashboard .top-selling {
    font-size: 14px;
}

.dashboard .top-selling .table thead {
    background: #f6f6fe;
}

.dashboard .top-selling .table thead th {
    border: 0;
}

.dashboard .top-selling .table tbody td {
    vertical-align: middle;
}

.dashboard .top-selling img {
    border-radius: 5px;
    max-width: 60px;
}
</style>