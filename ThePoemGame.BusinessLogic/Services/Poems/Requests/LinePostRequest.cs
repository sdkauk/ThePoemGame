using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ThePoemGame.Common.Models;

namespace ThePoemGame.BusinessLogic.Services.Poems.Requests
{
    public class LinePostRequest
    {
        public required Guid PoemId { get; set; }
        public required Guid GameId { get; set; }
        public required string Content { get; set; }
        public LineType Linetype { get; set; }
    }
}
