using Microsoft.AspNetCore.SpaServices.AngularCli;
using WebExplorer.Core.Interfaces;
using WebExplorer.Infrastructure;

namespace WebExplorer
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddCors(options =>
            {
                options.AddPolicy("AllowAngularApp", builder =>
                {
                    builder.WithOrigins("http://localhost:44430") // Update with your Angular app's URL
                           .AllowAnyHeader()
                           .AllowAnyMethod();
                });
            });


            services.AddTransient<IHackerNewsRepository, HackerNewsRepository>();

            services.AddControllersWithViews();
            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseCors("AllowAll");
            app.UseCors("AllowAngularApp");

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            app.UseCors(builder => builder
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader());

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
            });


            app.UseHttpsRedirection();
            app.UseStaticFiles();

            if (!env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }



            app.Use(async (context, next) =>
            {
                //Redirect to root request to /index.html ( except the GET request ) 
                //Do not generate logs for requests originating from automated tools: POST /Index.html, OPTIONS /index.html, DEBUG /index.htm, etc.. 
                if (!HttpMethods.IsGet(context.Request?.Method)
                    && context.Request?.Path.Value.ToLower() == "/index.html")
                {
                    context.Response.Redirect("/");
                    return;
                }

                try
                {
                    await next();
                }
                catch (InvalidOperationException spaException)
                {
                    if (spaException.Message.StartsWith("The SPA default page middleware could not return the default page"))
                    {
                        context.Response.StatusCode = StatusCodes.Status404NotFound;
                        return;
                    }
                    throw;
                }
            });
        }
    }
}
