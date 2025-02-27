import React, { useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import getDeployments from "../../redux/actions/getDeployments";
import Header from "../Header";
import SideNav from "../SideNav";
import InformationBar from "../InformationBar";
import Status from "../Status";
import ProgressBar from "../ProgressBar";
import Spinner from "../Spinner";
import tellAge from "../../helpers/ageUtility";
import "./DeploymentsPage.css";

const DeploymentsPage = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const { clusterID } = params;

  const clusterDeploys = useCallback(() =>
    dispatch(getDeployments(clusterID)), [clusterID, dispatch]);

  useEffect(() => {
    clusterDeploys();
  }, [clusterDeploys]);

  const { deployments, isFetchingDeployments, isFetched } = useSelector(
    (state) => state.deployments
  );

  const calculatePercentage = (proportion, total) => {
    return Math.round((proportion / total) * 100);
  };

  const displayFraction = (numerator, denominator) => {
    return `${numerator}/${denominator}`;
  };

  const deploymentStatus = (conditions) => {
    let status = "";
    conditions.map((condition) => {
      if (condition.type === "Available") {
        status = condition.status;
      }
      return null;
    });
    if (status === "True") {
      return true;
    }
    return false;
  };

  const clusterName = localStorage.getItem("clusterName");

  return (
    <div className="MainPage">
      <div className="TopBarSection">
        <Header />
      </div>
      <div className="MainSection">
        <div className="SideBarSection">
          <SideNav clusterName={clusterName} clusterId={params.clusterID} />
        </div>
        <div className="MainContentSection">
          <div className="InformationBarSection">
            <InformationBar header="Deployments" showBtn={false} />
          </div>
          <div className="ContentSection">
            <div
              className={
                isFetchingDeployments
                  ? "ResourcesTable LoadingResourcesTable"
                  : "ResourcesTable"
              }
            >
              <table>
                <thead className="uppercase">
                  <tr>
                    <th>name</th>
                    <th>ready</th>
                    <th>status</th>
                    <th>age</th>
                  </tr>
                </thead>
                {isFetchingDeployments ? (
                  <tbody>
                    <tr className="TableLoading">
                      <td>
                        <div className="SpinnerWrapper">
                          <Spinner size="big" />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody>
                    {isFetched &&
                      deployments !== undefined &&
                      deployments.map((deployment) => (
                        <tr key={deployments.indexOf(deployment)}>
                          <td>{deployment.metadata.name}</td>
                          <td>
                            {Object.prototype.hasOwnProperty.call(
                              deployment.status,
                              "readyReplicas"
                            ) ? (
                              <ProgressBar
                                percentage={calculatePercentage(
                                  deployment.status.readyReplicas,
                                  deployment.status.replicas
                                )}
                                fractionLabel={displayFraction(
                                  deployment.status.readyReplicas,
                                  deployment.status.replicas
                                )}
                              />
                            ) : (
                              <ProgressBar
                                percentage={calculatePercentage(
                                  0,
                                  deployment.status.replicas
                                )}
                                fractionLabel={displayFraction(
                                  0,
                                  deployment.status.replicas
                                )}
                              />
                            )}
                          </td>
                          <td>
                            <Status
                              status={deploymentStatus(
                                deployment.status.conditions
                              )}
                            />
                          </td>
                          <td>
                            {tellAge(deployment.metadata.creationTimestamp)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                )}
              </table>
              {isFetched && deployments.length === 0 && (
                <div className="NoResourcesMessage">
                  <p>No deployments available</p>
                </div>
              )}
              {!isFetchingDeployments && !isFetched && (
                <div className="NoResourcesMessage">
                  <p>
                    Oops! Something went wrong! Failed to retrieve deployments.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentsPage;
