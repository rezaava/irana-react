import React from "react";
import {
  FaChevronLeft,
  FaPaperPlane,
  FaMicrophone,
  FaStop,
  FaTrash,
  FaPlay,
  FaPause,
  FaPaperclip,
  FaFile,
} from "react-icons/fa";

const API_URL = "https://iranaserviceapp.ir/test/api";

class ChatPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      text: "",
      loading: true,
      sending: false,
      recording: false,
      audioUrl: null,
      audioDuration: 0,
      recordingTime: 0,
      selectedFile: null,
    };

    this.mediaRecorder = null;
    this.audioChunks = [];
    this.audioStream = null;
    this.audioBlob = null;
    this.timer = null;
    this.fileInput = null;
    this.audioPlayers = {};
  }

  componentDidMount() {
    this.previousBodyMargin =
      document.body.style.margin;

    this.previousBodyPadding =
      document.body.style.padding;

    this.previousNavOuterDisplay = [];

    document.body.style.margin = "0";
    document.body.style.padding = "0";
    this.previousBodyOverflow =
      document.body.style.overflow;

    this.previousBodyHeight =
      document.body.style.height;

    document.body.style.overflow = "hidden";
    document.body.style.height = "100dvh";

    const navOuterElements =
      document.querySelectorAll(".nav-outer");

    navOuterElements.forEach((element) => {
      this.previousNavOuterDisplay.push({
        element,
        display: element.style.display,
      });

      element.style.display = "none";
    });

    this.loadMessages();
  }

  componentWillUnmount() {
    document.body.style.overflow =
      this.previousBodyOverflow || "";

    document.body.style.height =
      this.previousBodyHeight || "";
    this.stopTimer();

    if (this.audioStream) {
      this.audioStream
        .getTracks()
        .forEach((track) => {
          track.stop();
        });
    }

    if (this.state.audioUrl) {
      URL.revokeObjectURL(
        this.state.audioUrl
      );
    }

    Object.values(this.audioPlayers).forEach(
      (audio) => {
        if (audio) {
          audio.pause();
        }
      }
    );

    document.body.style.margin =
      this.previousBodyMargin || "";

    document.body.style.padding =
      this.previousBodyPadding || "";

    if (this.previousNavOuterDisplay) {
      this.previousNavOuterDisplay.forEach(
        ({ element, display }) => {
          if (element) {
            element.style.display = display;
          }
        }
      );
    }
  }

  getUserId() {
    const parts =
      window.location.pathname
        .split("/")
        .filter(Boolean);

    return parts[parts.length - 1];
  }

  getCurrentUserId() {
    return Number(
      localStorage.getItem("user_id")
    );
  }

  getToken() {
    return localStorage.getItem("token");
  }

  loadMessages() {
    const userId = this.getUserId();
    const token = this.getToken();

    fetch(
      `${API_URL}/messages?user_id=${userId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) =>
        response.json()
      )
      .then((json) => {
        this.setState({
          messages: json.messages || [],
          loading: false,
        });
      })
      .catch((error) => {
        console.error(
          "MESSAGES ERROR:",
          error
        );

        this.setState({
          loading: false,
        });
      });
  }

  handleBack() {
    window.history.back();
  }

  handleTextChange(e) {
    this.setState({
      text: e.target.value,
    });
  }

  handleFileChange(e) {
    const file =
      e.target.files &&
      e.target.files[0];

    if (!file) {
      return;
    }

    this.setState({
      selectedFile: file,
    });

    e.target.value = "";
  }

  removeSelectedFile() {
    this.setState({
      selectedFile: null,
    });
  }

  handleSend(e) {
    e.preventDefault();

    const {
      text,
      selectedFile,
    } = this.state;

    if (
      !text.trim() &&
      !selectedFile
    ) {
      return;
    }

    const token = this.getToken();
    const userId = this.getUserId();

    this.setState({
      sending: true,
    });

    const formData =
      new FormData();

    formData.append(
      "user_id",
      userId
    );

    formData.append(
      "text",
      text.trim()
    );

    if (selectedFile) {
      formData.append(
        "file",
        selectedFile,
        selectedFile.name
      );

      formData.append(
        "size",
        selectedFile.size
      );

      formData.append(
        "hash",
        ""
      );
    }

    fetch(`${API_URL}/messages`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) =>
        response.json()
      )
      .then((data) => {
        console.log(
          "SEND MESSAGE:",
          data
        );

        if (data.status !== "1") {
          throw new Error(
            data.message ||
              "ارسال پیام انجام نشد."
          );
        }

        this.setState({
          sending: false,
          text: "",
          selectedFile: null,
        });

        this.loadMessages();
      })
      .catch((error) => {
        console.error(
          "SEND MESSAGE ERROR:",
          error
        );

        this.setState({
          sending: false,
        });

        alert(
          "ارسال پیام انجام نشد."
        );
      });
  }

  async startRecording() {
    try {
      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices
          .getUserMedia
      ) {
        alert(
          "مرورگر شما از ضبط صدا پشتیبانی نمی‌کند."
        );

        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia(
          {
            audio: true,
          }
        );

      this.audioStream = stream;
      this.audioChunks = [];
      this.audioBlob = null;

      let mimeType = "audio/webm";

      if (
        !MediaRecorder.isTypeSupported(
          "audio/webm"
        )
      ) {
        if (
          MediaRecorder.isTypeSupported(
            "audio/mp4"
          )
        ) {
          mimeType = "audio/mp4";
        } else if (
          MediaRecorder.isTypeSupported(
            "audio/ogg"
          )
        ) {
          mimeType = "audio/ogg";
        } else {
          mimeType = "";
        }
      }

      this.mediaRecorder = mimeType
        ? new MediaRecorder(stream, {
            mimeType,
          })
        : new MediaRecorder(stream);

      this.mediaRecorder.ondataavailable =
        (event) => {
          if (
            event.data &&
            event.data.size > 0
          ) {
            this.audioChunks.push(
              event.data
            );
          }
        };

      this.mediaRecorder.onstop = () => {
        const actualMimeType =
          this.mediaRecorder.mimeType ||
          mimeType ||
          "audio/webm";

        const audioBlob = new Blob(
          this.audioChunks,
          {
            type: actualMimeType,
          }
        );

        const audioUrl =
          URL.createObjectURL(
            audioBlob
          );

        const duration =
          this.state.recordingTime;

        this.audioBlob = audioBlob;

        this.setState({
          recording: false,
          audioUrl,
          audioDuration: duration,
          recordingTime: 0,
        });

        if (this.audioStream) {
          this.audioStream
            .getTracks()
            .forEach((track) =>
              track.stop()
            );

          this.audioStream = null;
        }

        this.stopTimer();
      };

      this.mediaRecorder.start();

      this.setState({
        recording: true,
        recordingTime: 0,
        audioUrl: null,
        audioDuration: 0,
      });

      this.startTimer();
    } catch (error) {
      console.error(
        "RECORDING ERROR:",
        error
      );

      alert(
        "دسترسی به میکروفون داده نشد. لطفاً اجازه استفاده از میکروفون را فعال کنید."
      );
    }
  }

  stopRecording() {
    if (
      this.mediaRecorder &&
      this.mediaRecorder.state !==
        "inactive"
    ) {
      this.mediaRecorder.stop();
    }
  }

  cancelRecording() {
    if (
      this.mediaRecorder &&
      this.mediaRecorder.state !==
        "inactive"
    ) {
      this.mediaRecorder.ondataavailable =
        null;

      this.mediaRecorder.onstop = null;

      this.mediaRecorder.stop();
    }

    if (this.audioStream) {
      this.audioStream
        .getTracks()
        .forEach((track) =>
          track.stop()
        );

      this.audioStream = null;
    }

    this.stopTimer();

    if (this.state.audioUrl) {
      URL.revokeObjectURL(
        this.state.audioUrl
      );
    }

    this.audioChunks = [];
    this.audioBlob = null;

    this.setState({
      recording: false,
      audioUrl: null,
      audioDuration: 0,
      recordingTime: 0,
    });
  }

  startTimer() {
    this.stopTimer();

    this.timer = setInterval(() => {
      this.setState(
        (prevState) => ({
          recordingTime:
            prevState.recordingTime + 1,
        })
      );
    }, 1000);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  formatTime(seconds) {
    if (
      !Number.isFinite(seconds) ||
      seconds < 0
    ) {
      return "00:00";
    }

    const minutes = Math.floor(
      seconds / 60
    );

    const remainingSeconds = Math.floor(
      seconds % 60
    );

    return `${String(
      minutes
    ).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }

  sendVoice() {
    if (!this.audioBlob) {
      return;
    }

    const token = this.getToken();
    const userId = this.getUserId();

    this.setState({
      sending: true,
    });

    const formData =
      new FormData();

    let extension = "webm";

    if (
      this.audioBlob.type.includes(
        "mp4"
      )
    ) {
      extension = "mp4";
    } else if (
      this.audioBlob.type.includes(
        "ogg"
      )
    ) {
      extension = "ogg";
    }

    const fileName = `voice_${Date.now()}.${extension}`;

    formData.append(
      "user_id",
      userId
    );

    formData.append(
      "file",
      this.audioBlob,
      fileName
    );

    formData.append(
      "text",
      ""
    );

    formData.append(
      "hash",
      ""
    );

    formData.append(
      "size",
      this.audioBlob.size
    );

    fetch(`${API_URL}/messages`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) =>
        response.json()
      )
      .then((data) => {
        console.log(
          "SEND VOICE:",
          data
        );

        if (data.status !== "1") {
          throw new Error(
            data.message ||
              "ارسال ویس انجام نشد."
          );
        }

        if (this.state.audioUrl) {
          URL.revokeObjectURL(
            this.state.audioUrl
          );
        }

        this.audioBlob = null;

        this.setState({
          sending: false,
          audioUrl: null,
          audioDuration: 0,
          recordingTime: 0,
        });

        this.loadMessages();
      })
      .catch((error) => {
        console.error(
          "SEND VOICE ERROR:",
          error
        );

        this.setState({
          sending: false,
        });

        alert(
          "ارسال ویس انجام نشد."
        );
      });
  }

  getFileUrl(file) {
    if (!file) {
      return "";
    }

    if (
      file.startsWith("http://") ||
      file.startsWith("https://")
    ) {
      return file;
    }

    return `${API_URL.replace(
      "/api",
      ""
    )}/files/chats${file}`;
  }

  getFileName(file) {
    if (!file) {
      return "فایل";
    }

    const parts =
      file.split("/");

    return (
      parts[parts.length - 1] ||
      "فایل"
    );
  }

  formatFileSize(size) {
    if (!size) {
      return "0 KB";
    }

    if (size < 1024) {
      return `${size} B`;
    }

    if (size < 1024 * 1024) {
      return `${(
        size / 1024
      ).toFixed(1)} KB`;
    }

    return `${(
      size /
      (1024 * 1024)
    ).toFixed(1)} MB`;
  }

  isAudioFile(file) {
    if (!file) {
      return false;
    }

    return /\.(webm|mp3|wav|ogg|m4a|mp4)$/i.test(
      file
    );
  }

  toggleAudio(
    messageId,
    src
  ) {
    let audio =
      this.audioPlayers[messageId];

    if (!audio) {
      audio = new Audio(src);

      this.audioPlayers[messageId] =
        audio;

      audio.addEventListener(
        "ended",
        () => {
          this.forceUpdate();
        }
      );

      audio.addEventListener(
        "timeupdate",
        () => {
          this.forceUpdate();
        }
      );

      audio.addEventListener(
        "loadedmetadata",
        () => {
          this.forceUpdate();
        }
      );
    }

    if (audio.paused) {
      Object.keys(
        this.audioPlayers
      ).forEach((id) => {
        if (
          id !==
            String(messageId) &&
          this.audioPlayers[id]
        ) {
          this.audioPlayers[id].pause();
        }
      });

      audio.play().catch((error) => {
        console.error(
          "AUDIO PLAY ERROR:",
          error
        );
      });
    } else {
      audio.pause();
    }

    this.forceUpdate();
  }

  seekAudio(
    messageId,
    event
  ) {
    const audio =
      this.audioPlayers[messageId];

    if (
      !audio ||
      !Number.isFinite(
        audio.duration
      ) ||
      audio.duration <= 0
    ) {
      return;
    }

    const rect =
      event.currentTarget.getBoundingClientRect();

    const x =
      event.clientX - rect.left;

    const percentage = Math.max(
      0,
      Math.min(
        1,
        x / rect.width
      )
    );

    audio.currentTime =
      percentage *
      audio.duration;

    this.forceUpdate();
  }

  renderAudioPlayer(
    message
  ) {
    const fileUrl =
      this.getFileUrl(
        message.file
      );

    const audio =
      this.audioPlayers[
        message.id
      ];

    const currentTime =
      audio &&
      Number.isFinite(
        audio.currentTime
      )
        ? audio.currentTime
        : 0;

    const duration =
      audio &&
      Number.isFinite(
        audio.duration
      ) &&
      audio.duration > 0
        ? audio.duration
        : 0;

    const playing =
      audio && !audio.paused;

    const bars = [
      7, 12, 18, 10, 15, 22, 13, 8,
      19, 25, 14, 10, 20, 16, 9, 14,
      23, 12, 18, 8, 15, 21, 11, 17,
      9, 20, 14, 24, 10, 16, 8, 19,
      13, 22, 11, 17, 9, 15, 23, 12,
      18, 10, 20, 14, 8, 16, 22, 11,
      19, 13, 24, 9, 17, 12, 21, 15,
    ];

    const progress =
      duration > 0
        ? Math.min(
            100,
            (currentTime /
              duration) *
              100
          )
        : 0;

      const isMine =
        Number(message.sender_id) !==
        Number(this.getUserId());
    const mainColor = isMine
      ? "#ffffff"
      : "#0d6efd";

    const inactiveColor = isMine
      ? "rgba(255,255,255,0.45)"
      : "#adb5bd";

    return (
      <div
        className="d-flex align-items-center"
        style={{
          width: "100%",
          minWidth: 230,
          maxWidth: 290,
          gap: 10,
        }}
      >
        <button
          type="button"
          onClick={() =>
            this.toggleAudio(
              message.id,
              fileUrl
            )
          }
          className="border-0 rounded-circle d-flex align-items-center justify-content-center"
          style={{
            width: 42,
            height: 42,
            minWidth: 42,
            backgroundColor: isMine
              ? "#ffffff"
              : "#0d6efd",
            color: isMine
              ? "#0d6efd"
              : "#ffffff",
            cursor: "pointer",
          }}
        >
          {playing ? (
            <FaPause size={14} />
          ) : (
            <FaPlay
              size={14}
              style={{
                marginRight: -2,
              }}
            />
          )}
        </button>

        <div
          className="d-flex flex-column flex-grow-1"
          style={{
            minWidth: 0,
          }}
        >
          <div
            className="d-flex align-items-center gap-1"
            onClick={(e) =>
              this.seekAudio(
                message.id,
                e
              )
            }
            style={{
              height: 34,
              overflow: "hidden",
              cursor: duration
                ? "pointer"
                : "default",
            }}
          >
            {bars.map(
              (
                height,
                index
              ) => {
                const position =
                  (index /
                    bars.length) *
                  100;

                const active =
                  position <=
                  progress;

                return (
                  <div
                    key={index}
                    style={{
                      width: 3,
                      height,
                      minHeight: 5,
                      borderRadius: 3,
                      backgroundColor:
                        active
                          ? mainColor
                          : inactiveColor,
                      transition:
                        "background-color 0.1s linear",
                      flexShrink: 0,
                    }}
                  />
                );
              }
            )}
          </div>

          <div
            className="d-flex justify-content-between align-items-center"
            style={{
              marginTop: 1,
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: isMine
                  ? "rgba(255,255,255,0.8)"
                  : "#6c757d",
              }}
            >
              {this.formatTime(
                currentTime
              )}
            </span>

            <span
              style={{
                fontSize: 11,
                color: isMine
                  ? "rgba(255,255,255,0.8)"
                  : "#6c757d",
              }}
            >
              {this.formatTime(
                duration
              )}
            </span>
          </div>
        </div>
      </div>
    );
  }

  renderMessage(message) {
    const hasFile =
      !!message.file;

    const hasText =
      !!message.text;

    const fileName =
      this.getFileName(
        message.file
      );

    const fileUrl =
      this.getFileUrl(
        message.file
      );

    const isAudio =
      this.isAudioFile(
        fileName
      );

    const isMine =
      Number(message.sender_id) !==
      Number(this.getUserId());
    return (
      <div
        key={message.id}
        className="mb-3"
        style={{
          textAlign: isMine
            ? "left"
            : "right",
        }}
      >
        <div
          className="d-inline-flex flex-column rounded-3 px-3 py-2"
          style={{
            maxWidth: "85%",
            minWidth: hasFile
              ? 260
              : "auto",
            textAlign: "right",
            backgroundColor: isMine
              ? "#0d6efd"
              : "#f1f3f5",
            color: isMine
              ? "#ffffff"
              : "#212529",
          }}
        >
          {hasFile &&
            isAudio &&
            this.renderAudioPlayer(
              message
            )}

          {hasFile &&
            !isAudio && (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none"
                style={{
                  color: "inherit",
                }}
              >
                <div
                  className="d-flex align-items-center gap-2"
                  style={{
                    minWidth: 220,
                    maxWidth: 280,
                  }}
                >
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: 42,
                      height: 42,
                      flexShrink: 0,
                      backgroundColor:
                        isMine
                          ? "rgba(255,255,255,0.2)"
                          : "#ffffff",
                    }}
                  >
                    <FaFile
                      style={{
                        color: isMine
                          ? "#ffffff"
                          : "#0d6efd",
                      }}
                      size={17}
                    />
                  </div>

                  <div
                    className="d-flex flex-column"
                    style={{
                      minWidth: 0,
                    }}
                  >
                    <span
                      className="fw-semibold"
                      style={{
                        fontSize: 13,
                        wordBreak:
                          "break-word",
                      }}
                    >
                      {fileName}
                    </span>

                    <span
                      style={{
                        fontSize: 11,
                        color: isMine
                          ? "rgba(255,255,255,0.8)"
                          : "#6c757d",
                      }}
                    >
                      دانلود فایل
                    </span>
                  </div>
                </div>
              </a>
            )}

          {hasText && (
            <div
              className={
                hasFile
                  ? "mt-1"
                  : ""
              }
              style={{
                wordBreak:
                  "break-word",
                color: isMine
                  ? "#ffffff"
                  : "#212529",
              }}
            >
              {message.text}
            </div>
          )}

          <div
            className="mt-1"
            style={{
              fontSize: 10,
              color: isMine
                ? "rgba(255,255,255,0.7)"
                : "#6c757d",
            }}
          >
            {message.sender &&
            message.sender.name
              ? message.sender.name
              : ""}
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {
      messages,
      text,
      loading,
      sending,
      recording,
      audioUrl,
      audioDuration,
      recordingTime,
      selectedFile,
    } = this.state;

    return (
      <div
        className="d-flex flex-column"
        style={{
          height: "100dvh",
          maxHeight: "100dvh",
          overflow: "hidden",
        }}
      >
        {loading && (
          <div
            className="position-fixed top-0 start-0 w-100"
            style={{
              zIndex: 9999,
            }}
          >
            <div
              className="d-flex justify-content-center align-items-center"
              style={{
                height: 3,
              }}
            >
              <div
                className="bg-primary"
                style={{
                  width: "100%",
                  height: 3,
                }}
              />
            </div>
          </div>
        )}

        <div
          className="d-flex align-items-center justify-content-between px-3 pt-4 pb-3 border-bottom"
          style={{
            maxWidth: 480,
            margin: "0 auto",
            width: "100%",
          }}
        >
          <button
            type="button"
            onClick={() =>
              this.handleBack()
            }
            className="btn btn-light rounded-circle border p-2 d-flex align-items-center justify-content-center"
            style={{
              width: 36,
              height: 36,
            }}
          >
            <FaChevronLeft
              size={14}
            />
          </button>

          <h1 className="fs-6 fw-semibold text-dark m-0">
            پشتیبانی کاربر
          </h1>

          <div
            style={{
              width: 36,
            }}
          />
        </div>

        <div
          className="flex-grow-1 px-3 py-3"
          style={{
            maxWidth: 480,
            margin: "0 auto",
            width: "100%",
            overflowY: "auto",
            overflowX: "hidden",
            minHeight: 0,
          }}
        >
          {messages.length ===
            0 &&
          !loading ? (
            <div className="text-center text-muted py-5">
              هنوز پیامی وجود ندارد.
            </div>
          ) : (
            messages.map(
              (message) =>
                this.renderMessage(
                  message
                )
            )
          )}
        </div>

        {selectedFile &&
          !recording &&
          !audioUrl && (
            <div
              className="px-3 pb-2"
              style={{
                maxWidth: 480,
                margin: "0 auto",
                width: "100%",
              }}
            >
              <div className="border rounded-4 px-3 py-2 bg-light d-flex align-items-center gap-2">
                <div
                  className="rounded-circle bg-white d-flex align-items-center justify-content-center"
                  style={{
                    width: 38,
                    height: 38,
                    flexShrink: 0,
                  }}
                >
                  <FaFile
                    className="text-primary"
                    size={15}
                  />
                </div>

                <div
                  className="flex-grow-1 text-end"
                  style={{
                    minWidth: 0,
                  }}
                >
                  <div
                    className="text-dark fw-semibold"
                    style={{
                      fontSize: 13,
                      overflow:
                        "hidden",
                      textOverflow:
                        "ellipsis",
                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    {
                      selectedFile.name
                    }
                  </div>

                  <div
                    className="text-muted"
                    style={{
                      fontSize: 11,
                    }}
                  >
                    {this.formatFileSize(
                      selectedFile.size
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    this.removeSelectedFile()
                  }
                  disabled={sending}
                  className="btn btn-light text-danger rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: 34,
                    height: 34,
                    flexShrink: 0,
                  }}
                >
                  <FaTrash
                    size={13}
                  />
                </button>
              </div>
            </div>
          )}

        {audioUrl &&
          !recording && (
            <div
              className="px-3 pb-2"
              style={{
                maxWidth: 480,
                margin: "0 auto",
                width: "100%",
              }}
            >
              <div
                className="border rounded-4 p-2 d-flex align-items-center gap-2"
                style={{
                  backgroundColor:
                    "#f8f9fa",
                }}
              >
                <div
                  className="flex-grow-1"
                  style={{
                    minWidth: 0,
                  }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const audio =
                          document.getElementById(
                            "admin-preview-audio"
                          );

                        if (!audio) {
                          return;
                        }

                        if (
                          audio.paused
                        ) {
                          audio
                            .play()
                            .catch(
                              () => {}
                            );
                        } else {
                          audio.pause();
                        }
                      }}
                      className="border-0 rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: 42,
                        height: 42,
                        minWidth: 42,
                        backgroundColor:
                          "#0d6efd",
                        color:
                          "#fff",
                      }}
                    >
                      <FaPlay
                        size={14}
                      />
                    </button>

                    <audio
                      id="admin-preview-audio"
                      src={audioUrl}
                      preload="metadata"
                      style={{
                        display:
                          "none",
                      }}
                    />

                    <div className="flex-grow-1">
                      <div
                        className="text-muted"
                        style={{
                          fontSize: 12,
                        }}
                      >
                        ویس آماده ارسال
                      </div>

                      <div
                        className="text-dark"
                        style={{
                          fontSize: 11,
                        }}
                      >
                        {this.formatTime(
                          audioDuration
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    this.cancelRecording()
                  }
                  disabled={sending}
                  className="btn btn-light text-danger rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: 40,
                    height: 40,
                    flexShrink: 0,
                  }}
                >
                  <FaTrash
                    size={14}
                  />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    this.sendVoice()
                  }
                  disabled={sending}
                  className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: 40,
                    height: 40,
                    flexShrink: 0,
                  }}
                >
                  <FaPaperPlane
                    size={14}
                  />
                </button>
              </div>
            </div>
          )}

        {!recording &&
          !audioUrl && (
            <form
              onSubmit={(e) =>
                this.handleSend(e)
              }
              className="d-flex align-items-center gap-2 px-3 py-3 border-top"
              style={{
                maxWidth: 480,
                margin: "0 auto",
                width: "100%",
              }}
            >
              <input
                ref={(input) => {
                  this.fileInput =
                    input;
                }}
                type="file"
                onChange={(e) =>
                  this.handleFileChange(
                    e
                  )
                }
                style={{
                  display: "none",
                }}
              />

              <button
                type="button"
                onClick={() => {
                  if (
                    this.fileInput
                  ) {
                    this.fileInput.click();
                  }
                }}
                disabled={sending}
                className="btn btn-light border rounded-circle p-2 d-flex align-items-center justify-content-center"
                style={{
                  width: 40,
                  height: 40,
                  flexShrink: 0,
                }}
                title="انتخاب فایل"
              >
                <FaPaperclip
                  size={16}
                />
              </button>

              <button
                type="button"
                onClick={() =>
                  this.startRecording()
                }
                disabled={sending}
                className="btn btn-light border rounded-circle p-2 d-flex align-items-center justify-content-center"
                style={{
                  width: 40,
                  height: 40,
                  flexShrink: 0,
                }}
                title="ضبط صدا"
              >
                <FaMicrophone
                  size={16}
                />
              </button>

              <input
                type="text"
                placeholder="پیام خود را بنویسید..."
                value={text}
                onChange={(e) =>
                  this.handleTextChange(
                    e
                  )
                }
                className="form-control border rounded-pill text-end px-3 py-2"
              />

              <button
                type="submit"
                disabled={
                  sending ||
                  (!text.trim() &&
                    !selectedFile)
                }
                className="btn btn-primary rounded-circle p-2 d-flex align-items-center justify-content-center"
                style={{
                  width: 40,
                  height: 40,
                  flexShrink: 0,
                }}
              >
                <FaPaperPlane
                  size={14}
                />
              </button>
            </form>
          )}

        {recording && (
          <div
            className="px-3 py-3 border-top"
            style={{
              maxWidth: 480,
              margin: "0 auto",
              width: "100%",
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  this.cancelRecording()
                }
                className="btn btn-light text-danger border rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: 40,
                  height: 40,
                  flexShrink: 0,
                }}
              >
                <FaTrash
                  size={14}
                />
              </button>

              <div className="flex-grow-1 bg-light rounded-pill px-3 py-2 d-flex align-items-center justify-content-between">
                <span className="text-danger fw-semibold">
                  ● در حال ضبط
                </span>

                <span className="text-dark">
                  {this.formatTime(
                    recordingTime
                  )}
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  this.stopRecording()
                }
                className="btn btn-danger rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: 40,
                  height: 40,
                  flexShrink: 0,
                }}
              >
                <FaStop size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default ChatPage;