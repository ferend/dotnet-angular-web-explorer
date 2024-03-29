﻿
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Microsoft.Extensions.Caching.Memory;
using WebExplorer.Core.Interfaces;

namespace WebExplorer.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class HackerNewsController : ControllerBase
    {
        private IMemoryCache _cache;

        private readonly IHackerNewsRepository _repo;

        private readonly ILogger<HackerNewsController> _logger;


        public HackerNewsController(IMemoryCache cache, IHackerNewsRepository repository, ILogger<HackerNewsController> logger)
        {
            this._cache = cache;
            this._repo = repository;
            _logger = logger;
        }

        public async Task<List<HackerNewsStory>> Index(string searchTerm)
        {
            List<HackerNewsStory> stories = new List<HackerNewsStory>();

            var response = await _repo.BestStoriesAsync();
            if (response.IsSuccessStatusCode)
            {
                var storiesResponse = response.Content.ReadAsStringAsync().Result;
                var bestIds = JsonConvert.DeserializeObject<List<int>>(storiesResponse);

                var tasks = bestIds.Select(GetStoryAsync);
                stories = (await Task.WhenAll(tasks)).ToList();

                if (!String.IsNullOrEmpty(searchTerm))
                {
                    var search = searchTerm.ToLower();
                    stories = stories.Where(s =>
                                       s.Title.ToLower().IndexOf(search) > -1 || s.By.ToLower().IndexOf(search) > -1)
                                       .ToList();
                }
            }
            return stories;
        }

        [HttpGet("hackernews")]
        private async Task<HackerNewsStory> GetStoryAsync(int storyId)
        {
            return await _cache.GetOrCreateAsync<HackerNewsStory>(storyId,
                async cacheEntry =>
                {
                    HackerNewsStory story = new HackerNewsStory();

                    var response = await _repo.GetStoryByIdAsync(storyId);
                    if (response.IsSuccessStatusCode)
                    {
                        var storyResponse = response.Content.ReadAsStringAsync().Result;
                        story = JsonConvert.DeserializeObject<HackerNewsStory>(storyResponse);
                    }

                    return story;
                });
        }
    }
}
