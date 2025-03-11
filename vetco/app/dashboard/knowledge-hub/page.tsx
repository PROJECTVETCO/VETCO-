"use client"

import { useState, useEffect } from "react"
import { Search, Download, Share2, Bookmark, Star, StarHalf } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function KnowledgeHubPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("articles")
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)

  interface Article {
    id: number
    title: string
    summary: string
    content: string
    image: string
    date: string
    author: string
  }

  interface Video {
    id: number
    title: string
    summary: string
    duration: string
    thumbnail: string
  }

  // Mock data for articles
  const articles: Article[] = [
    {
      id: 1,
      title: "Disease Prevention Guide",
      summary: "Learn how to prevent common livestock diseases during monsoon season.",
      content:
        "Monsoon season brings unique challenges for livestock health. This comprehensive guide covers preventive measures for common diseases that affect cattle, goats, and poultry during rainy seasons. Key topics include proper shelter management, vaccination schedules, feed adjustments, and early warning signs of common monsoon-related illnesses.\n\nProper drainage around animal housing is essential to prevent waterlogging and the growth of disease-causing organisms. Ensure that animal shelters have adequate ventilation while protecting from rain and wind. Regularly clean and disinfect all housing areas.\n\nVaccination schedules may need adjustment before monsoon season begins. Consult with your veterinarian about boosters for foot and mouth disease, hemorrhagic septicemia, and other seasonal concerns.\n\nDuring monsoon, feed quality can deteriorate rapidly due to moisture. Store feed in dry, elevated areas and inspect regularly for mold or spoilage. Consider supplementing with vitamins A, D, and E which help boost immunity.",
      image: "/placeholder.svg?height=200&width=400",
      date: "March 1, 2025",
      author: "Dr. James Smith",
    },
    {
      id: 2,
      title: "Government Subsidies 2025",
      summary: "New agricultural subsidies available for small-scale farmers.",
      content:
        "The Ministry of Agriculture has announced new subsidy programs for small-scale farmers effective April 2025. These programs aim to support sustainable farming practices, improve livestock health, and increase agricultural productivity across rural communities.\n\nThe Livestock Health Initiative provides up to 50% subsidy on veterinary services and medications for registered farmers with fewer than 50 animals. To qualify, farmers must maintain proper health records and participate in the national animal identification program.\n\nThe Farm Equipment Modernization Program offers low-interest loans and direct subsidies for purchasing essential farming equipment. Small-scale farmers can receive up to 40% subsidy on approved equipment purchases.\n\nThe Sustainable Farming Practices Grant provides financial support for farmers implementing environmentally friendly farming methods. This includes water conservation systems, renewable energy for farm operations, and organic farming transitions.\n\nApplications for all programs open on April 1, 2025, and close on April 15, 2025. Farmers can apply through the Ministry's online portal or at local agricultural extension offices.",
      image: "/placeholder.svg?height=200&width=400",
      date: "February 25, 2025",
      author: "Ministry of Agriculture",
    },
    {
      id: 3,
      title: "Improving Milk Production",
      summary: "Strategies to enhance milk yield and quality in dairy cattle.",
      content:
        "Maximizing milk production requires a comprehensive approach that addresses nutrition, health, comfort, and management practices. This article explores evidence-based strategies that can help dairy farmers increase both milk yield and quality.\n\nNutrition is the foundation of milk production. A balanced diet with proper protein-to-energy ratios is essential. Consider working with a nutritionist to formulate rations specific to your herd's needs and production stage. High-quality forage should make up 40-60% of the diet, supplemented with appropriate concentrates.\n\nRegular health monitoring and preventive care significantly impact production. Implement a comprehensive vaccination program and maintain strict mastitis prevention protocols. Regular hoof trimming and prompt treatment of lameness will ensure cows remain comfortable and active.\n\nCow comfort directly influences milk production. Provide adequate resting areas with proper bedding, ensure good ventilation, and minimize heat stress during hot weather. Research shows that cows with comfortable housing produce 5-10% more milk than those in suboptimal conditions.\n\nConsistent milking routines and proper milking technique are crucial. Train staff thoroughly and maintain milking equipment regularly. Consider implementing technologies like automatic milking systems or milk meters to monitor individual cow performance.",
      image: "/placeholder.svg?height=200&width=400",
      date: "February 15, 2025",
      author: "Dr. Angela Mwangi",
    },
  ]

  // Mock data for videos
  const videos: Video[] = [
    {
      id: 1,
      title: "Cattle Vaccination Techniques",
      summary: "Learn proper vaccination techniques from our experts.",
      duration: "12:45",
      thumbnail: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 2,
      title: "Dairy Farm Management",
      summary: "Best practices for managing a small dairy farm.",
      duration: "18:30",
      thumbnail: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 3,
      title: "Poultry Disease Identification",
      summary: "How to identify common poultry diseases early.",
      duration: "15:20",
      thumbnail: "/placeholder.svg?height=200&width=400",
    },
  ]

  // Check for URL parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    // Check for article parameter
    const articleId = params.get("article")
    if (articleId) {
      const article = articles.find((a) => a.id === Number.parseInt(articleId))
      if (article) {
        setSelectedArticle(article)
        setActiveTab("articles")
      }
    }

    // Check for video parameter
    const videoId = params.get("video")
    if (videoId) {
      const video = videos.find((v) => v.id === Number.parseInt(videoId))
      if (video) {
        setSelectedVideo(video)
        setActiveTab("videos")
      }
    }

    // Check for tab parameter
    const tab = params.get("tab")
    if (tab && ["articles", "videos", "faq"].includes(tab)) {
      setActiveTab(tab)
    }
  }, [])

  // Filter articles based on search
  const filteredArticles = articles.filter(
    (article) =>
      searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Filter videos based on search
  const filteredVideos = videos.filter(
    (video) =>
      searchQuery === "" ||
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.summary.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const readArticle = (article: Article) => {
    setSelectedArticle(article)
  }

  const watchVideo = (video: Video) => {
    setSelectedVideo(video)
  }

  const saveArticle = (id: number) => {
    toast({
      title: "Article saved",
      description: "This article has been saved to your bookmarks",
    })
  }

  const shareArticle = (id: number) => {
    toast({
      title: "Sharing article",
      description: "Share options opened",
    })
  }

  return (
    <DashboardLayout>
      <div className="container p-4 md:p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Knowledge Hub</h1>
          <p className="text-muted-foreground">Access resources and information to help manage your farm</p>
        </div>

        {selectedArticle ? (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{selectedArticle.title}</CardTitle>
                  <CardDescription>
                    By {selectedArticle.author} • {selectedArticle.date}
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setSelectedArticle(null)}>
                  Back to Articles
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted mb-6">
                <img
                  src={selectedArticle.image || "/placeholder.svg"}
                  alt={selectedArticle.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="space-y-4">
                {selectedArticle.content.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="text-sm">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => saveArticle(selectedArticle.id)}>
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="sm" onClick={() => shareArticle(selectedArticle.id)}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Downloading PDF",
                      description: "Article is being downloaded as PDF",
                    })
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Thank you!",
                      description: "Your rating has been submitted",
                    })
                  }}
                >
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Thank you!",
                      description: "Your rating has been submitted",
                    })
                  }}
                >
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Thank you!",
                      description: "Your rating has been submitted",
                    })
                  }}
                >
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Thank you!",
                      description: "Your rating has been submitted",
                    })
                  }}
                >
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Thank you!",
                      description: "Your rating has been submitted",
                    })
                  }}
                >
                  <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ) : selectedVideo ? (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{selectedVideo.title}</CardTitle>
                  <CardDescription>{selectedVideo.duration} • Educational Video</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setSelectedVideo(null)}>
                  Back to Videos
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted flex items-center justify-center mb-6 relative">
                <img
                  src={selectedVideo.thumbnail || "/placeholder.svg"}
                  alt={selectedVideo.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    size="lg"
                    onClick={() => {
                      toast({
                        title: "Video playback",
                        description: "This would play the actual video in production",
                      })
                    }}
                  >
                    Play Video
                  </Button>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-sm">{selectedVideo.summary}</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Video saved",
                      description: "This video has been saved to your bookmarks",
                    })
                  }}
                >
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Sharing video",
                      description: "Share options opened",
                    })
                  }}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Thank you!",
                      description: "Your rating has been submitted",
                    })
                  }}
                >
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Thank you!",
                      description: "Your rating has been submitted",
                    })
                  }}
                >
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Thank you!",
                      description: "Your rating has been submitted",
                    })
                  }}
                >
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Thank you!",
                      description: "Your rating has been submitted",
                    })
                  }}
                >
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Thank you!",
                      description: "Your rating has been submitted",
                    })
                  }}
                >
                  <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ) : (
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>
            <TabsContent value="articles" className="mt-4">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search articles"
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {filteredArticles.length === 0 ? (
                    <div className="md:col-span-3 text-center py-8 text-muted-foreground">
                      No articles found matching your search
                    </div>
                  ) : (
                    filteredArticles.map((article) => (
                      <Card key={article.id} className="overflow-hidden">
                        <div className="aspect-video bg-muted">
                          <img
                            src={article.image || "/placeholder.svg"}
                            alt={article.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <CardHeader className="p-4">
                          <CardTitle className="text-lg">{article.title}</CardTitle>
                          <CardDescription>
                            {article.date} • {article.author}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-sm text-muted-foreground">{article.summary}</p>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex justify-between">
                          <Button size="sm" onClick={() => readArticle(article)}>
                            Read Article
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => saveArticle(article.id)}>
                            <Bookmark className="h-4 w-4" />
                            <span className="sr-only">Save</span>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="videos" className="mt-4">
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search videos"
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {filteredVideos.length === 0 ? (
                    <div className="md:col-span-3 text-center py-8 text-muted-foreground">
                      No videos found matching your search
                    </div>
                  ) : (
                    filteredVideos.map((video) => (
                      <Card key={video.id} className="overflow-hidden">
                        <div className="aspect-video bg-muted relative">
                          <img
                            src={video.thumbnail || "/placeholder.svg"}
                            alt={video.title}
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="h-12 w-12 rounded-full bg-black/50 flex items-center justify-center">
                              <div className="h-0 w-0 border-y-8 border-y-transparent border-l-12 border-l-white ml-1"></div>
                            </div>
                          </div>
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {video.duration}
                          </div>
                        </div>
                        <CardHeader className="p-4">
                          <CardTitle className="text-lg">{video.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <p className="text-sm text-muted-foreground">{video.summary}</p>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex justify-between">
                          <Button size="sm" onClick={() => watchVideo(video)}>
                            Watch Video
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              toast({
                                title: "Video saved",
                                description: "This video has been saved to your bookmarks",
                              })
                            }}
                          >
                            <Bookmark className="h-4 w-4" />
                            <span className="sr-only">Save</span>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="faq" className="mt-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>How often should I vaccinate my cattle?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Vaccination schedules vary by disease and region. Generally, most cattle require annual
                      vaccinations for common diseases like FMD. Consult with your veterinarian for a customized
                      vaccination schedule based on your specific herd, local disease risks, and regional regulations.
                    </p>
                    <p className="text-sm mt-2">
                      For calves, a typical schedule might include vaccinations at 2-3 months of age, with boosters 3-4
                      weeks later. Adult cattle often receive annual boosters before breeding season or during specific
                      risk periods.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Contact a vet",
                          description: "Opening vet directory for consultation",
                        })
                        window.location.href = "/dashboard/vet-directory"
                      }}
                    >
                      Ask a Veterinarian
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>What signs indicate my livestock might be sick?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Common signs include reduced appetite, lethargy, abnormal discharge, coughing, diarrhea, or
                      changes in milk production. Any sudden behavioral changes should be evaluated by a veterinarian.
                    </p>
                    <p className="text-sm mt-2">
                      Other warning signs include isolation from the herd, unusual posture, labored breathing, excessive
                      salivation, and changes in manure consistency. Early detection is crucial for effective treatment,
                      so regular observation of your animals is essential.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Emergency guide",
                          description: "Opening emergency response guide",
                        })
                      }}
                    >
                      View Emergency Guide
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>How can I improve milk production in my dairy cows?</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Ensure proper nutrition with balanced feed, maintain good hygiene, provide clean water, establish
                      regular milking schedules, control parasites, and ensure adequate housing with proper ventilation.
                    </p>
                    <p className="text-sm mt-2">
                      Genetic selection also plays a crucial role in milk production. Consider artificial insemination
                      with semen from bulls with high milk production traits. Stress management is equally important -
                      minimize handling stress and provide shade during hot weather.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      size="sm"
                      onClick={() => {
                        toast({
                          title: "Opening article",
                          description: "Navigating to detailed milk production article",
                        })
                        readArticle(articles.find((a) => a.id === 3)!)
                      }}
                    >
                      Read Full Article
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  )
}

