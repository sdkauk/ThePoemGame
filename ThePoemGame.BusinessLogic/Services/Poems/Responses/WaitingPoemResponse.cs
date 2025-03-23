using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ThePoemGame.Common.Models;

namespace ThePoemGame.BusinessLogic.Services.Poems.Responses
{
    public class WaitingPoemResponse
    {
        public Guid PoemId { get; set; }
        public string Title { get; set; }
        public BasicUser Author { get; set; }
        public int LineCount { get; set; }
        public Guid GameId { get; set; }
        public string GameName { get; set; }
    }
}
