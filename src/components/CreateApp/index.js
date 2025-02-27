import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import PrimaryButton from "../PrimaryButton";
import Select from "../Select";
//import CancelButton from "../CancelButton";
import NewButton from "../NewButton";
import BlackInputText from "../BlackInputText";
import { v4 as uuidv4 } from "uuid";
// import Modal from "../Modal";
import RemoveIcon from "../../assets/images/remove.svg";
//import ToggleOnOffButton from "../ToggleOnOffButton";
import Spinner from "../Spinner";
import Feedback from "../Feedback";
import Checkbox from "../Checkbox";
import Tooltip from "../Tooltip";
import Tabs from "../Tabs";
import createApp, { clearState } from "../../redux/actions/createApp";
import styles from "./CreateApp.module.css";
import { validateName } from "../../helpers/validation";

class CreateApp extends React.Component {
  constructor(props) {
    super(props);

    const {
      clusters: { clusters },
    } = this.props;
    this.state = {
      name: "",
      uri: "",
      varName: "",
      varValue: "",
      envVars: {},
      error: "",
      createFeedback: "",
      entryCommand: "",
      port: "",
      isPrivateImage: false,
      isCustomDomain: false,
      domainName: "",
      dockerCredentials: {
        username: "",
        email: "",
        password: "",
        server: "",
        error: "",
      },
      replicas: 1,
      multiCluster: false,
      SelectedClusters: new Array(clusters.length).fill(false),
    };

    this.addEnvVar = this.addEnvVar.bind(this);
    this.removeEnvVar = this.removeEnvVar.bind(this);
    this.showForm = this.showForm.bind(this);
    this.hideForm = this.hideForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateDomainName = this.validateDomainName.bind(this);
    this.togglePrivateImage = this.togglePrivateImage.bind(this);
    this.toggleCustomDomain = this.toggleCustomDomain.bind(this);
    this.handleDockerCredentialsChange =
      this.handleDockerCredentialsChange.bind(this);
    this.handleSelectReplicas = this.handleSelectReplicas.bind(this);
    this.changeMultiSelectionOption =
      this.changeMultiSelectionOption.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
  }
  handleOnChange(position) {
    const { SelectedClusters } = this.state;
    this.setState({
      SelectedClusters: SelectedClusters.map((item, index) =>
        index === position ? !item : item
      ),
    });
  }
  changeMultiSelectionOption() {
    const { multiCluster } = this.state;
    this.setState({
      multiCluster: !multiCluster,
    });
  }

  componentDidMount() {
    const { clearState } = this.props;
    clearState();
  }

  componentDidUpdate(prevProps) {
    const {
      isCreated,
      params: { projectID },
    } = this.props;

    if (isCreated !== prevProps.isCreated) {
      return <Redirect to={`/projects/${projectID}/Apps`} noThrow />;
    }
  }

  showForm() {
    this.setState({ openModal: true });
  }

  hideForm() {
    const { clearState } = this.props;
    clearState();
    this.setState(this.initialState);
  }

  validateDomainName(domainName) {
    const expression =
      /[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&//=]*)?/gi;
    const regex = new RegExp(expression);
    if (regex.test(domainName)) {
      if (domainName.match(!regex)) {
        return "false_convention";
      }
      return true;
    }
    return false;
  }

  handleChange(e) {
    const { error, createFeedback } = this.state;
    this.setState({
      [e.target.name]: e.target.value,
    });
    if (error) {
      this.setState({
        error: "",
      });
    }
    if (createFeedback) {
      this.setState({
        createFeedback: "",
      });
    }
  }

  handleDockerCredentialsChange({ target, target: { value } }) {
    const { dockerCredentials } = this.state;
    this.setState((prevState) => ({
      dockerCredentials: {
        ...prevState.dockerCredentials,
        [target.name]: value,
      },
    }));
    if (dockerCredentials.error) {
      this.setState((prevState) => ({
        dockerCredentials: {
          ...prevState.dockerCredentials,
          error: "",
        },
      }));
    }
  }

  addEnvVar() {
    const { varName, varValue } = this.state;

    if (varName && varValue) {
      this.setState((prevState) => ({
        envVars: {
          ...prevState.envVars,
          [varName]: varValue,
        },
      }));
      this.setState({
        varName: "",
        varValue: "",
      });
    }
  }

  removeEnvVar(index) {
    const { envVars } = this.state;
    const keyToRemove = Object.keys(envVars)[index];
    const newEnvVars = Object.keys(envVars).reduce((object, key) => {
      if (key !== keyToRemove) {
        object[key] = envVars[key]; // eslint-disable-line no-param-reassign
      }
      return object;
    }, {});

    this.setState({ envVars: newEnvVars });
  }

  togglePrivateImage() {
    const { isPrivateImage } = this.state;
    this.setState({
      isPrivateImage: !isPrivateImage,
    });
  }

  toggleCustomDomain() {
    const { isCustomDomain } = this.state;
    this.setState({
      isCustomDomain: !isCustomDomain,
    });
  }

  handleSelectReplicas(selected) {
    this.setState({ replicas: selected.id });
  }

  handleSubmit() {
    const {
      name,
      uri,
      envVars,
      entryCommand,
      port,
      isPrivateImage,
      dockerCredentials: { username, email, password, server },
      isCustomDomain,
      domainName,
      replicas,
    } = this.state;
    const { createApp, params } = this.props;

    if (!name || !uri) {
      // if user tries to submit empty email/password
      this.setState({
        error: "app name & image uri are required",
      });
    } else if (validateName(name) === false) {
      this.setState({
        error: "Name should start with a letter",
      });
    } else if (validateName(name) === "false_convention") {
      this.setState({
        error: "Name may only contain letters,numbers,dot and a hypen -",
      });
    } else if (name.length > 27) {
      this.setState({
        error: "Name may not exceed 27 characters",
      });
    } else if (port && !/^[0-9]*$/.test(port)) {
      // validate port and ensure its a number
      this.setState({
        error: "Port should be an integer",
      });
    } else if (
      isPrivateImage &&
      (!email || !username || !password || !server)
    ) {
      this.setState((prevState) => ({
        dockerCredentials: {
          ...prevState.dockerCredentials,
          error: "please provide all the information above",
        },
      }));
    } else if (isCustomDomain && !domainName) {
      this.setState({
        error: "Please enter a domain name",
      });
    } else if (domainName && this.validateDomainName(domainName) === false) {
      this.setState({
        error: "Domain name should start with a letter",
      });
    } else if (
      domainName &&
      this.validateDomainName(domainName) === "false_convention"
    ) {
      this.setState({
        error: "Use accepted formats for example google.com, domain.ug",
      });
    } else {
      let appInfo = {
        command: entryCommand,
        env_vars: envVars,
        image: uri,
        name,
        project_id: params.projectID,
        private_image: isPrivateImage,
        replicas,
      };

      if (isCustomDomain === true) {
        let sentDomainName = domainName.toLowerCase();
        if (port) {
          appInfo = { ...appInfo, port: parseInt(port, 10) };
        }

        if (isPrivateImage) {
          appInfo = {
            ...appInfo,
            docker_email: email,
            docker_username: username,
            docker_password: password,
            docker_server: server,
          };
        }
        appInfo = { ...appInfo, custom_domain: sentDomainName };

        createApp(appInfo, params.projectID);
      } else {
        if (port) {
          appInfo = { ...appInfo, port: parseInt(port, 10) };
        }

        if (isPrivateImage) {
          appInfo = {
            ...appInfo,
            docker_email: email,
            docker_username: username,
            docker_password: password,
            docker_server: server,
          };
        }

        createApp(appInfo, params.projectID);
      }
    }
  }

  render() {
    const {
      isCreating,
      isCreated,
      message,
      errorCode,
      params: { projectID },
      data: { beta },
      clusters: { clusters },
    } = this.props;
    const {
      name,
      uri,
      varName,
      varValue,
      envVars,
      error,
      entryCommand,
      port,
      isPrivateImage,
      dockerCredentials,
      dockerCredentials: { username, email, password, server },
      isCustomDomain,
      domainName,
      multiCluster,
      SelectedClusters,
    } = this.state;
    if (isCreated) {
      return <Redirect to={`/projects/${projectID}/Apps`} noThrow />;
    }
    const replicaOptions = [
      { id: 1, name: "1" },
      { id: 2, name: "2" },
      { id: 3, name: "3" },
      { id: 4, name: "4" },
    ];
    return (
      <div className={styles.Page}>
        <div className={styles.MainContentSection}>
          <div className={styles.InformationBarSection}>
            <div className={styles.InformationBar}>
              <div className={styles.InformationBarWithButton}>
                <div className={styles.InfoHeader}>Create App</div>
                <div className={styles.RoundAddButtonWrap}>
                 {/* <CancelButton onClick={this.props.closeComponent} />*/}
                  <NewButton label="close"  type="close" onClick={this.props.closeComponent}/>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.ContentSection}>
            <div className={styles.ModalFormInputs}>
              <div className={styles.FormHeading}>
                Fields marked * are required
              </div>
              <div className={styles.ModalFormInputsBasic}>
                <BlackInputText
                  required
                  placeholder="Name"
                  name="name"
                  value={name}
                  onChange={(e) => {
                    this.handleChange(e);
                  }}
                  className="ReplicasSelect"
                />

                <div className={styles.ReplicasSelect}>
                  <Select
                    placeholder="Number of Replicas - defaults to 1"
                    options={replicaOptions}
                    onChange={this.handleSelectReplicas}
                  />
                </div>

                <div className={styles.InputFieldWithTooltip}>
                  <BlackInputText
                    required
                    placeholder="Image URI"
                    name="uri"
                    value={uri}
                    onChange={(e) => {
                      this.handleChange(e);
                    }}
                  />
                  <div className={styles.InputTooltipContainer}>
                    <Tooltip
                      showIcon
                      message="Image URI e.g for docker: ngnixdemos/hello with ngnixdemos being your username and hello being the image name"
                      position="left"
                    />
                  </div>
                </div>

                <div className={styles.PrivateImageCheckField}>
                  <Checkbox
                    isBlack
                    onClick={this.togglePrivateImage}
                    isChecked={isPrivateImage}
                  />
                  &nbsp; Private Image
                </div>

                {isPrivateImage && (
                  <div className={styles.PrivateImageTabContainer}>
                    <Tabs>
                      <div index={1} /* label={<DockerLogo />} */>
                        <div className={styles.PrivateImageInputs}>
                          <BlackInputText
                            required
                            placeholder="Username"
                            name="username"
                            value={username}
                            onChange={(e) => {
                              this.handleDockerCredentialsChange(e);
                            }}
                          />

                          <BlackInputText
                            required
                            placeholder="Email"
                            name="email"
                            value={email}
                            onChange={(e) => {
                              this.handleDockerCredentialsChange(e);
                            }}
                          />

                          <BlackInputText
                            required
                            placeholder="Password"
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => {
                              this.handleDockerCredentialsChange(e);
                            }}
                          />
                          <div className={styles.InputFieldWithTooltip}>
                            <BlackInputText
                              required
                              placeholder="Registry Server"
                              name="server"
                              value={server}
                              onChange={(e) => {
                                this.handleDockerCredentialsChange(e);
                              }}
                            />
                            <div className={styles.InputTooltipContainerDB}>
                              <Tooltip
                                showIcon
                                message="Registry server for example: docker.io or gcr.io"
                                position="left"
                              />
                            </div>
                          </div>

                          {dockerCredentials.error && (
                            <Feedback
                              type="error"
                              message={dockerCredentials.error}
                            />
                          )}
                        </div>
                      </div>
                    </Tabs>
                  </div>
                )}

                {/** <div className={styles.ClusterSelectionSection}>
                 <div className={styles.alignText}>Multicluster options</div>
                  <div className={styles.TooltipStyles}>
                    <Tooltip
                      showIcon
                      message="Choose cluster policy for your application deployment"
                    />
                  </div>
                </div>
                 <div className={styles.ClusterToggleSection}>
                  <ToggleOnOffButton
                    onClick={this.changeMultiSelectionOption}
                  />{" "}
                  &nbsp; Deploy app on the same datacenter(s) as project.
                </div>*/}
                {multiCluster && (
                  <div className={styles.ClustersSection}>
                    <div className={styles.MultiSelectionText}>
                      Please select a datacenter(s) you would like your app to
                      be deployed to.
                    </div>
                    <div className={styles.Multipleclusters}>
                      {clusters.map(({ name, id }, index) => {
                        return (
                          <li className={styles.ListStyle} key={index}>
                            <div className={styles.clusterListItem}>
                              <div className={styles.leftsection}>
                                <input
                                  type="checkbox"
                                  id={id}
                                  name={name}
                                  value={name}
                                  checked={SelectedClusters[index]}
                                  onChange={() => this.handleOnChange(index)}
                                />
                                <label
                                  className={styles.ClusterLabel}
                                  htmlFor={id}
                                >
                                  {name}
                                </label>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </div>
                  </div>
                )}

                {beta && (
                  <div className={styles.CustomDomainCheckField}>
                    <Checkbox
                      isBlack
                      onClick={this.toggleCustomDomain}
                      isChecked={isCustomDomain}
                    />
                    &nbsp; Custom Domain
                  </div>
                )}

                {isCustomDomain && (
                  <div className={styles.CustomDomainTabContainer}>
                    <Tabs>
                      <div index={1}>
                        <div className={styles.InputFieldWithTooltip}>
                          <BlackInputText
                            required
                            placeholder="Domain name"
                            name="domainName"
                            value={domainName}
                            onChange={(e) => {
                              this.handleChange(e);
                            }}
                          />
                          <div className={styles.InputTooltipContainer}>
                            <Tooltip
                              showIcon
                              message="You will be given IP addresses to link your hosting provider DNS to our servers"
                              position="left"
                            />
                          </div>
                        </div>
                      </div>
                    </Tabs>
                  </div>
                )}

                <div className={styles.InputFieldWithTooltip}>
                  <BlackInputText
                    placeholder="Entry Command"
                    name="entryCommand"
                    value={entryCommand}
                    onChange={(e) => {
                      this.handleChange(e);
                    }}
                  />
                  <div className={styles.InputTooltipContainer}>
                    <Tooltip
                      showIcon
                      message="Entrypoint or command for your container"
                      position="left"
                    />
                  </div>
                </div>
                <div className={styles.InputFieldWithTooltip}>
                  <BlackInputText
                    placeholder="Port (optional) - defaults to 80"
                    name="port"
                    value={port}
                    onChange={(e) => {
                      this.handleChange(e);
                    }}
                  />
                  <div className={styles.InputTooltipContainer}>
                    <Tooltip
                      showIcon
                      message="Exposed port of your container"
                      position="left"
                    />
                  </div>
                </div>

                {error && <Feedback type="error" message={error} />}
              </div>
              <div className={styles.ModalFormInputsEnvVars}>
                <div className={styles.HeadingWithTooltip}>
                  <h4>Environment Variables</h4>
                  <Tooltip
                    showIcon
                    message="These are are key/value pairs which define aspects of your app’s environment that can vary"
                  />
                </div>
                {Object.keys(envVars).length > 0 && (
                  <div className={styles.EnvVarsTable}>
                    <table>
                      <thead>
                        <tr>
                          <td>Name</td>
                          <td>Value</td>
                          <td>Remove</td>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(envVars).map((envVar, index) => (
                          <tr key={uuidv4()}>
                            <td>{Object.keys(envVars)[index]}</td>
                            <td>{envVars[Object.keys(envVars)[index]]}</td>
                            <td>
                              <img
                                src={RemoveIcon}
                                alt="remove_ico"
                                onClick={() => this.removeEnvVar(index)}
                                role="presentation"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className={styles.EnvVarsInputGroup}>
                  <div className={styles.EnvVarsInputs}>
                    <BlackInputText
                      placeholder="Name"
                      name="varName"
                      value={varName}
                      onChange={(e) => {
                        this.handleChange(e);
                      }}
                    />
                    <BlackInputText
                      placeholder="Value"
                      name="varValue"
                      value={varValue}
                      onChange={(e) => {
                        this.handleChange(e);
                      }}
                    />
                  </div>
                  <div className={styles.EnvVarsAddBtn}>
                    <PrimaryButton
                      label="add"
                      onClick={this.addEnvVar}
                      className={styles.EnvVarAddBtn}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.ModalFormButtons}>
                {message && (
                  <Feedback
                    message={
                      errorCode === 409
                        ? "Name already in use, please choose another and try again"
                        : message
                    }
                    type={isCreated && errorCode !== 409 ? "success" : "error"}
                  />
                )}

                <PrimaryButton
                  className="AuthBtn FullWidth"
                  label={isCreating ? <Spinner /> : "deploy"}
                  onClick={this.handleSubmit}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
CreateApp.propTypes = {
  isCreating: PropTypes.bool,
  isCreated: PropTypes.bool,
  message: PropTypes.string,
  clusters: PropTypes.object,
  getClustersList: PropTypes.func.isRequired,
  params: PropTypes.shape({}),
};

CreateApp.defaultProps = {
  message: "",
  clusters: [],
  isCreated: false,
  isCreating: false,
  params: {},
};

const mapStateToProps = (state) => {
  const { isCreating, isCreated, clearAppCreateState, message, errorCode } =
    state.createAppReducer;
  const { data } = state.user;
  const { clusters } = state.clustersReducer;

  return {
    isCreating,
    message,
    isCreated,
    clearAppCreateState,
    errorCode,
    clusters,
    data,
  };
};

const mapDispatchToProps = {
  createApp,
  clearState,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateApp);
