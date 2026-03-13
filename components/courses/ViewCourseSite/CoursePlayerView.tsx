"use client";

import MuxPlayer from "@mux/mux-player-react";

import { useState } from "react";
import {
  Menu,
  Play,
  ChevronLeft,
  ChevronRight,
  PlayCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn, formatDuration } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { CourseReviews } from "../../reviews/CourseReviews";

interface CoursePlayerViewProps {
  course: App.Course;
  initialVideoId?: number | null;
  isPreviewMode?: boolean;
  user?: App.authContextType["user"] | null;
  token?: string | null;
}

export function CoursePlayerView({
  course,
  initialVideoId,
  isPreviewMode = false,
  user,
  token,
}: CoursePlayerViewProps) {
  const allVideos = course.chapters.flatMap((chapter) =>
    chapter.videos.map((video) => ({
      ...video,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      isFreePreview: chapter.isFreePreview,
    })),
  );

  const visibleVideos = isPreviewMode
    ? allVideos.filter((v) => v.isFreePreview)
    : allVideos;

  const [activeVideo, setActiveVideo] = useState(
    (initialVideoId
      ? visibleVideos.find((v) => v.id === initialVideoId)
      : visibleVideos[0]) || null,
  );

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleVideoChange = (video: typeof activeVideo) => {
    if (isPreviewMode && !video?.isFreePreview) return;
    setActiveVideo(video);
  };

  if (!activeVideo)
    return <div className="p-10 text-center">No content available</div>;

  return (
    <div className="relative flex flex-col md:flex-row w-full min-h-screen bg-background border-b">
      {/* Sidebar - Course Content */}
      <div
        className={cn(
          "flex-shrink-0 border-r bg-muted/20 transition-all duration-300 ease-in-out relative flex flex-col",
          "w-full md:w-80", // Full width mobile, fixed desktop
          "order-2 md:order-1", // Bottom mobile, Left desktop
          "h-auto md:h-auto", // Auto height allows expansion on mobile, follows flex on desktop
          !sidebarOpen && "md:-ml-80 hidden md:flex", // Hide on mobile if closed? No, usually keep visible or use Accordion. Let's just use standard sidebar logic for desktop.
        )}
      >
        <div className="p-4 border-b flex items-center justify-between bg-background md:bg-transparent">
          <h2 className="font-semibold text-sm line-clamp-1">Course Content</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="h-8 w-8 hidden md:flex" // Hide collapse on mobile
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <Accordion
            type="multiple"
            defaultValue={[
              course.chapters
                .find((c) => (isPreviewMode ? c.isFreePreview : true))
                ?.id.toString() || "",
            ]}
            className="w-full"
          >
            {course.chapters
              .filter((chapter) => !isPreviewMode || chapter.isFreePreview)
              .map((chapter) => (
                <AccordionItem key={chapter.id} value={chapter.id.toString()}>
                  <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
                    <div className="text-left w-full">
                      <div className="font-medium text-sm break-words">
                        {chapter.title}
                      </div>
                      <div className="text-xs text-muted-foreground font-normal mt-1">
                        {chapter.videos.length} videos |{" "}
                        {formatDuration(
                          chapter.videos.reduce(
                            (acc, video) => acc + video.duration,
                            0,
                          ),
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-0">
                    <div className="flex flex-col">
                      {chapter.videos.map((video) => {
                        const isActive = activeVideo?.id === video.id;
                        return (
                          <button
                            key={video.id}
                            onClick={() => {
                              handleVideoChange({
                                ...video,
                                chapterId: chapter.id,
                                chapterTitle: chapter.title,
                                isFreePreview: chapter.isFreePreview,
                              });
                              // Optional: Scroll to top on mobile when clicking?
                              if (window.innerWidth < 768) {
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }
                            }}
                            className={cn(
                              "flex items-start gap-3 px-4 py-3 text-left w-full hover:bg-muted/50 transition-colors border-l-2 border-transparent",
                              isActive && "bg-primary/10 border-primary",
                            )}
                          >
                            <div
                              className={cn(
                                "mt-0.5 shrink-0",
                                isActive
                                  ? "text-primary"
                                  : "text-muted-foreground",
                              )}
                            >
                              {isActive ? (
                                <PlayCircle className="w-4 h-4" />
                              ) : (
                                <Play className="w-4 h-4" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span
                                className={cn(
                                  "text-sm block break-words",
                                  isActive && "font-medium text-primary",
                                )}
                              >
                                {video.title}
                              </span>
                              <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                <PlayCircle className="w-3 h-3" />{" "}
                                {video.duration} mins
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
          </Accordion>
        </ScrollArea>
      </div>

      {/* Main Content Area */}
      <div
        className={cn(
          "flex-1 flex flex-col h-full overflow-hidden order-1 md:order-2",
          "min-h-[50vh]", // Ensure height on mobile
        )}
      >
        {/* Toggle Sidebar Button (Visible when closed) - Desktop Only */}
        {!sidebarOpen && (
          <div className="absolute top-4 left-4 z-20 hidden md:block">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="shadow-md"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Video Player Section */}
        <div className="bg-black w-full aspect-video md:max-h-[70vh] flex items-center justify-center relative shadow-xl z-10">
          {activeVideo.url ? (
            activeVideo.provider === "Mux" ? (
              <MuxPlayer
                className="w-full h-full"
                playbackId={activeVideo.url}
              />
            ) : (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${activeVideo.url.split("/").pop()}`}
                title={activeVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; fullscreen; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            )
          ) : (
            <div className="text-white">Video Source Unavailable</div>
          )}
        </div>

        {/* Video Details & Tabs */}
        <div className="flex-1 overflow-y-auto bg-background">
          <div className="container mx-auto px-4 py-6 max-w-5xl">
            <div className="mb-6">
              <h1 className="text-xl md:text-2xl font-bold mb-2">
                {activeVideo.title}
              </h1>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <p className="text-muted-foreground text-sm md:text-base">
                  {activeVideo.chapterTitle}
                </p>
                <div className="flex gap-2 w-full md:w-auto">
                  <Button
                    onClick={() => {
                      const currentIndex = allVideos.findIndex(
                        (v) => v.id === activeVideo.id,
                      );
                      const prevVideo = allVideos[currentIndex - 1];
                      if (prevVideo) handleVideoChange(prevVideo);
                    }}
                    disabled={
                      allVideos.findIndex((v) => v.id === activeVideo.id) === 0
                    }
                    variant="outline"
                    size="sm"
                    className="flex-1 md:flex-none"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const currentIndex = allVideos.findIndex(
                        (v) => v.id === activeVideo.id,
                      );
                      const nextVideo = allVideos[currentIndex + 1];
                      if (nextVideo) handleVideoChange(nextVideo);
                    }}
                    disabled={
                      allVideos.findIndex((v) => v.id === activeVideo.id) ===
                      allVideos.length - 1
                    }
                    className="flex-1 md:flex-none"
                  >
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <Tabs defaultValue="overview">
              <TabsList className="w-full md:w-[40%] justify-start overflow-hidden">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-6 space-y-4">
                <h3 className="font-semibold text-lg">About this lesson</h3>
                <p className="text-muted-foreground">
                  {activeVideo.description}
                </p>
              </TabsContent>
              <TabsContent value="resources" className="mt-6">
                <p className="text-muted-foreground">
                  No resources attached to this lesson.
                </p>
              </TabsContent>
              <TabsContent value="reviews" className="mt-6">
                <CourseReviews
                  courseId={course.id}
                  currentUser={user}
                  token={token}
                  isEnrolled={!isPreviewMode}
                />
              </TabsContent>
              <TabsContent value="qa" className="mt-6">
                <p className="text-muted-foreground">
                  Discussion forum coming soon.
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
