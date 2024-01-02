namespace WebExplorer.Core.Interfaces
{
    public interface IHackerNewsRepository
    {
        Task<HttpResponseMessage> BestStoriesAsync();
        Task<HttpResponseMessage> GetStoryByIdAsync(int id);

    }
}
