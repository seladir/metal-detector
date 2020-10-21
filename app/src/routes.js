/*!

=========================================================
* Material Dashboard React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// core components/views for Admin layout
import DetectTrack from "views/Detection/DetectTrack.js";
import DetectionResult from "views/Detection/DetectionResult.js";

const dashboardRoutes = [
  {
    path: "/result/:id",
    name: "Detection Result",
    component: DetectionResult,
    layout: "/admin"
  },
  {
    path: "/",
    name: "Detect Track",
    component: DetectTrack,
    layout: "/admin"
  },
];

export default dashboardRoutes;
