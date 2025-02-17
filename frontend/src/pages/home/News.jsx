import React from "react";
import axios from "axios";

class News extends React.Component {
  state = {
    allArticles: [],      // Lưu trữ toàn bộ bài (ví dụ 20 bài)
    displayArticles: [],  // 10 bài đang hiển thị
    nextIndex: 0,
    isLoading: true,
    error: null,
    page: 2,
    pageSize: 20
  };

  componentDidMount() {
    this.fetchArticles(20);//Page Size set for 20
    console.log("call after render");
    this.intervalId = setInterval(() => {this.fetchArticles(20);}, 86400000);
  }
  componentWillUnmount() {
    // Xóa interval khi component unmount để tránh để lộ thông tin
    clearInterval(this.intervalId);
  }
   fetchArticles = (count) => {
    axios
      .get(`https://newsapi.org/v2/everything?q=ai&language=vi&pageSize=${count}&apiKey=84c6ca56664f462ca58c69c955335dff`)
      .then((response) => {
        const raw = response.data.articles || [];
        const allArticles = raw.map((article) => ({
          title: article.title,
          url: article.url,
          urlToImage: article.urlToImage,
          date: article.publishedAt,
          description: article.description
        }));
        // Lấy 10 bài viết đầu tiên (có thể điều chỉnh)
        const displayArticles = allArticles.slice(0, 10);
        const nextIndex = displayArticles.length;
        this.setState({
          allArticles,
          displayArticles,
          nextIndex,
          isLoading: false,
          error: null,
          pageSize: count
        });
      })
      .catch((error) => {
        this.setState({ error, isLoading: false });
      });
  };
    // Hàm xóa 1 bài viết khỏi danh sách
    handleDelete = (index) => {
      this.setState((prevState) => {
        const { displayArticles, allArticles, nextIndex } = prevState;
        const newDisplay = [...displayArticles];
        newDisplay.splice(index, 1);

        let newNextIndex = nextIndex;
        // Nếu còn bài trong allArticles, đẩy 1 bài vào display
        if (newNextIndex < allArticles.length) {
        newDisplay.push(allArticles[newNextIndex]);
        newNextIndex++;
        }

        return {
          displayArticles: newDisplay,
          nextIndex: newNextIndex
        };
      });
    };
    fetct
    // Hàm Thêm tin => Lấy thêm 10 bài mới, nối vào allArticles
    async fetchMoreArticles(page, pageSize) {
      try {
        const response = await axios.get(`https://newsapi.org/v2/everything?q=ai&language=vi&pageSize=${pageSize}&page=${page}&apiKey=84c6ca56664f462ca58c69c955335dff`);
        return response.data;
      } catch (error) {
        this.setState({ error, isLoading: false });
      }
        
    }
    handleAddNews = () => {
        this.setState({ isLoading: true });
        const pageSize = this.state.pageSize;
        const currentPage = this.state.page;
        const currentIndex = this.state.nextIndex;
        const currentAllArticlesLength = this.state.allArticles.length;
        // Check 
        console.log(currentIndex);
        if(currentIndex >= currentAllArticlesLength) {
          // fetch more
          this.fetchMoreArticles(currentPage, pageSize).then((data) => {
            const newArticles = data.articles.map((article) => ({
              title: article.title,
              url: article.url,
              urlToImage: article.urlToImage,
              date: article.publishedAt,
              description: article.description
            }));
            // Nối thêm
            console.log("Articles to add");
            console.log(newArticles);
            console.log("Call this");
            this.setState((prevState) => {
              const currentDisplayArticles = this.state.displayArticles;
              const merged = [...prevState.allArticles, ...newArticles];
              return {
                allArticles: merged,
                displayArticles: [...currentDisplayArticles,...newArticles],
                nextIndex: currentIndex + 10,
                isLoading: false,
                page: this.state.page + 1
              };
            });
          }).catch(error => {
            console.error("Error fetching more articles", error);
            this.setState({ error, isLoading: false });
          });
        }
        else {
          console.log("Lazy loading articles");
          const newArticles = this.state.allArticles.slice(currentIndex, currentAllArticlesLength)
          console.log(newArticles);
          const currentDisplayArticles = this.state.displayArticles;
          this.setState({
            displayArticles: [...currentDisplayArticles,...newArticles],
            nextIndex: currentIndex + newArticles.length,
            isLoading: false
          })
        }
  };
  render() {
    const { displayArticles, isLoading, error } = this.state;

    if (isLoading) {
      return <p>Loading...</p>;
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">News</h2>
        {/* Nút thêm tin (phòng khi bạn muốn nạp thêm dữ liệu) */}
        <div className="mb-4">
          <button
            onClick={this.handleAddNews}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Thêm tin
          </button>
        </div>
        <div>
          { error ? (
              <p className="text-red-500 font-semibold">Các bài viết hiện không khả dụng vui lòng đợi cập nhật thêm</p>
            ) : <></>
          }
        </div>
        
        {/*Dùng overflow-x-auto để cho phép cuộn ngang khi nội dung quá rộng*/}
        <div className="overflow-x-auto">
          <div className="flex w-[72rem] space-x-4">
            {displayArticles.map((article, index) => (
              <div
                key={index}
                className="flex-none w-72 bg-white shadow-md rounded-md overflow-hidden"
              >
                {/* Ảnh có link đến bài viết */}
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                {article.urlToImage && (
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                </a>
                {/* Nội dung card */}
                <div className="p-4 flex flex-col">
                {/* Tiêu đề có link */}
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                  </a>
                  <p className="text-sm text-gray-500 mb-2">{article.date}</p>
                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                    {article.description || "No description available"}
                  </p>
                {/* Nút Xóa */}
                  <button
                    onClick={() => this.handleDelete(index)}
                    className="mt-auto bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"> 
                     Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
export default News;
