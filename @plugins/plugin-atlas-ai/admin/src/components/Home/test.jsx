import React, { useState, useEffect, useRef } from "react";
import { useIntl } from "react-intl";
import { Helmet } from "react-helmet";
import GitHubButton from "react-github-btn";
import { auth } from "@strapi/helper-plugin";
import axios from "axios";
import {
  SingleSelectOption,
  SingleSelect,
  TextInput,
  Button,
  Layout,
  HeaderLayout,
  ContentLayout,
  Main,
  Box,
  Card,
  CardBody,
  CardContent,
  Grid,
  GridItem,
  ActionLayout,
  Tab,
  Stack,
  Tabs,
  TabGroup,
  TabPanels,
  TabPanel,
  Typography,
} from "@strapi/design-system";
import { PaperPlane, Command, Cog, Picture, PlusCircle } from "@strapi/icons";

import CustomTab from "./tab";
import Response from "./response";
import Help from "../Help";
import LoadingOverlay from "../Loading";
import Integration from "../Integration";

const Home = () => {
  const { formatMessage } = useIntl();
  const [prompt, setPrompt] = useState("");
  const [highlightedId, setHighlighted] = useState(0);
  const [convos, setConvos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isApiIntegrationModalVisible, setIsApiIntegrationModalVisible] =
    useState(false);

  const instance = axios.create({
    baseURL: process.env.STRAPI_ADMIN_BACKEND_URL,
    headers: {
      Authorization: `Bearer ${auth.get("jwtToken")}`,
      "Content-Type": "application/json",
    },
  });

  const handlePromptChange = (e) => {
    setError("");
    setPrompt(e.target.value);
  };

  const setSelectedResponse = (index) => {
    if (index >= convos.length) {
      setError(
        formatMessage({ id: "strapi-supergpt.homePage.error.unselectableTab" })
      );
      return;
    }
    const selectedConvo = convos[index];
    if (!selectedConvo.content.length) {
      instance
        .get(`/strapi-supergpt/convo/${selectedConvo.id}`)
        .then((content) => {
          const updatedConvos = [...convos];
          updatedConvos[index] = { ...selectedConvo, content: content.data };
          setConvos(updatedConvos);
        });
    }
    setHighlighted(index);
  };

  const handleCreateTab = async () => {
    const defaultConvoName = formatMessage({
      id: "strapi-supergpt.homePage.convo.new.name",
    });
    const { data: newConvo } = await instance.post(`/strapi-supergpt/convo`, {
      name: `${defaultConvoName} ${convos.length + 1}`,
    });
    setConvos((prevConvos) => [...prevConvos, newConvo]);
    setHighlighted(newConvo.id);
  };

  const handleSaveTab = async (e) => {
    const id = convos[highlightedId];
    await instance
      .put(`/strapi-supergpt/convo`, {
        name: id,
        content: convos[highlightedId],
      })
      .then((convo) => setConvos([...convos, convo.data]));
  };

  const handleDeleteTab = async (id) => {
    if (convos.length > 1) {
      await instance.delete(`/strapi-supergpt/convo/${id}`);
      setConvos((prevConvos) => {
        const updatedConvos = prevConvos.filter((convo) => convo.id !== id);
        const newHighlightedId =
          updatedConvos.length > 0 ? updatedConvos[0].id : null;
        setHighlighted(newHighlightedId);
        return updatedConvos;
      });
    } else {
      await instance.put(`/strapi-supergpt/convo/${id}`, {
        name: formatMessage({
          id: "strapi-supergpt.homePage.convo.default.name",
        }),
        content: [],
      });
      setConvos([
        {
          id,
          name: formatMessage({
            id: "strapi-supergpt.homePage.convo.default.name",
          }),
          content: [],
        },
      ]);
      setHighlighted(id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!prompt) {
      setError(
        formatMessage({ id: "strapi-supergpt.homePage.error.promptRequired" })
      );
      return;
    }

    let response;

    if (e.target.name !== "picture") {
      setLoading(true);
      const format = formatMessage({
        id: "strapi-supergpt.homePage.prompt.format",
      });
      const { data } = await instance.post("/strapi-supergpt/prompt", {
        prompt: `${prompt} ${format}?`,
      });
      response = data;
    }

    if (response.error || !response.response) {
      setLoading(false);
      setError(response.error);
      return;
    }

    let highlightedConvo = convos[highlightedId];

    highlightedConvo.content = [
      ...highlightedConvo.content,
      {
        name: "you",
        message: prompt,
      },
      {
        name: "chatgpt",
        message: response.response,
      },
    ];

    await instance.put(`/strapi-supergpt/convo/${highlightedConvo.id}`, {
      name: highlightedConvo.name,
      content: highlightedConvo.content,
    });

    setLoading(false);
    setPrompt("");
  };

  useEffect(() => {
    if (convos.length === 0) {
      instance.get("/strapi-supergpt/convos").then((conversations) => {
        if (conversations.data.length > 0) {
          setConvos(conversations.data);
        } else {
          handleCreateTab();
        }
      });
    }
  }, [setConvos]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return (
    <Layout>
      <Helmet title={"strapi-supergpt"} />
      <Main aria-busy={false}>
        <HeaderLayout
          title={
            <Box display="flex" alignItems="center">
              <Typography variant="alpha" as="h1">
                SuperGPT
              </Typography>
              <Box marginLeft={2}>
                <GitHubButton
                  href="https://github.com/theCompanyDream/strapi-supergpt"
                  data-color-scheme="no-preference: light; light: light; dark: dark;"
                  data-icon="octicon-star"
                  data-size="small"
                  data-show-count="true"
                  aria-label="Star theCompanyDream/strapi-supergpt on GitHub"
                >
                  Star
                </GitHubButton>
              </Box>
            </Box>
          }
          subtitle={formatMessage({
            id: "strapi-supergpt.homePage.header",
          })}
        />
        <ContentLayout>
          <TabGroup onTabChange={setSelectedResponse}>
            <Tabs>
              {convos.length > 0 &&
                convos.map((convo) => (
                  <CustomTab
                    key={convo.id}
                    value={convo.id}
                    onRename={handleSaveTab}
                    onDelete={() => handleDeleteTab(convo.id)}
                  >
                    {convo.name}
                  </CustomTab>
                ))}
              <Tab onClick={handleCreateTab}>
                <PlusCircle />
              </Tab>
            </Tabs>
            <TabPanels>
              {convos.length > 0 &&
                convos.map((convo) => (
                  <TabPanel key={convo.id}>
                    <Card>
                      <CardBody
                        style={{
                          height: "64vh",
                          overflowY: "scroll",
                          width: "100%",
                        }}
                      >
                        <CardContent>
                          <LoadingOverlay isLoading={loading} />
                          {convo.content.map((response, index) => (
                            <Response key={`${index}`}>{response}</Response>
                          ))}
                          <div ref={messagesEndRef} />
                        </CardContent>
                      </CardBody>
                    </Card>
                  </TabPanel>
                ))}
            </TabPanels>
          </TabGroup>
          <Box>
            <form>
              <Grid spacing={1} gap={2} paddingTop={4}>
                <GridItem col={11}>
                  <TextInput
                    id="chatInput"
                    placeholder={formatMessage({
                      id: "strapi-supergpt.homePage.prompt.placeholder",
                    })}
                    aria-label="Content"
                    name="prompt"
                    error={error}
                    onChange={handlePromptChange}
                    value={prompt}
                    disabled={loading}
                    onPaste={(e) => {
                      e.preventDefault();
                      setError("");
                    }}
                  />
                </GridItem>
                <GridItem
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "0.5rem",
                  }}
                >
                  <Button
                    size="L"
                    name="prompt"
                    startIcon={<PaperPlane />}
                    value="prompt"
                    loading={loading}
                    onClick={handleSubmit}
                  >
                    {formatMessage({
                      id: "strapi-supergpt.homePage.prompt.button",
                    })}
                  </Button>
                  <Button
                    size="L"
                    name="picture"
                    value="picture"
                    onClick={handleSubmit}
                    startIcon={<Picture />}
                  >
                    {formatMessage({
                      id: "strapi-supergpt.homePage.image.button",
                    })}
                  </Button>
                </GridItem>
              </Grid>
            </form>
          </Box>
        </ContentLayout>
        <Help
          isOpen={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        />
        <Integration
          isOpen={isApiIntegrationModalVisible}
          onClose={() => setIsApiIntegrationModalVisible(false)}
        />
      </Main>
    </Layout>
  );
};

export default Home;
